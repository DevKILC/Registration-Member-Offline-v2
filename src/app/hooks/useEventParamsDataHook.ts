import { useState, useEffect, useCallback } from "react";
import { getCookies } from "./useCookiesData";
import { useQueryParamsDataStore } from "@/app/hooks/useQueryParamsDataStore";
import { EventParamsData } from "@/app/_backend/_utils/Interfaces";
import clidService from "../services/leadGetClidService";

// Helper function untuk set cookie
const setCookie = (name: string, value: string, days: number = 90) => {
    const maxAge = 60 * 60 * 24 * days;
    document.cookie = `${name}=${value}; path=/; max-age=${maxAge}`;
};

export const useEventParamsData = (): { 
    eventParamsData: EventParamsData | null;
    getClidData: (phone_number: string) => Promise<boolean>;
    isLoading: boolean;
    error: string | null;
} => {
    const { queryParams } = useQueryParamsDataStore();
    const [eventParamsData, setEventParamsData] = useState<EventParamsData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Memoize getClidData function dengan useCallback
    const getClidData = useCallback(async (
        phone_number: string
    ): Promise<boolean> => {
        try {
            setIsLoading(true);
            setError(null);

            // Jika cookie fbc atau ttclid sudah ada, skip request
            const [fbcCookie, ttclidCookie] = await Promise.all([
                getCookies("_fbc"),
                getCookies("_ttclid")
            ]);

            if (fbcCookie?.value || ttclidCookie?.value) {
                console.log('Clid found in cookies. Skipping clid request.');
                return false;
            }

            // Jika query params ada fbc atau ttclid, skip request
            if (queryParams?.fbc || queryParams?.ttclid) {
                console.log('Clid found in query params. Skipping clid request.');
                return false;
            }

            // Jika fbc atau ttclid tidak ada di eventParamsData, get dari lead service
            if (!eventParamsData?.fbc && !eventParamsData?.ttclid) {
                console.log('Clid not detected. Fetching clid data for phone number:', phone_number);
                
                const result = await clidService.getClid({ phone_number });

                if (result?.data?.clid) {
                    const { source, id } = result.data.clid;

                    // Validasi: source dan id harus ada keduanya, jika salah satu kosong maka skip
                    if (!source || !id) {
                        console.log('Incomplete clid data (missing source or id). Skipping.');
                        return false;
                    }

                    if (source === 'meta_ads') {
                        setCookie('_fbc', id);
                        setCookie('utm_source', 'FB');
                        console.log('FBC Cookie set:', id);
                        console.log('UTM Source set: FB');
                        
                        // Update eventParamsData
                        setEventParamsData(prev => prev ? {
                            ...prev,
                            fbc: id,
                            utm_source: 'FB',
                            source: 'meta_ads'
                        } : null);
                        
                        return true;
                    }
                    
                    if (source === 'tiktok_ads') {
                        setCookie('_ttclid', id);
                        setCookie('utm_source', 'TTADS');
                        console.log('TTCLID Cookie set:', id);
                        console.log('UTM Source set: TTADS');
                        
                        // Update eventParamsData
                        setEventParamsData(prev => prev ? {
                            ...prev,
                            ttclid: id,
                            utm_source: 'TTADS',
                            source: 'tiktok_ads'
                        } : null);
                        
                        return true;
                    }
                    
                    // Jika source tidak dikenali
                    console.log('Unknown source:', source);
                }
            }
            
            return false;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch clid data';
            console.error('Error fetching clid data:', errorMessage);
            setError(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [queryParams, eventParamsData]);

    useEffect(() => {
        let mounted = true;

        const loadEventParams = async () => {
            try {
                // Get cookies
                const [
                    fbpCookie,
                    ttpCookie,
                    fbcCookie,
                    ttclidCookie,
                    utmContentCookie,
                    utmMediumCookie,
                    utmSourceCookie,
                    utmCampaignCookie,
                    utmTermCookie
                ] = await Promise.all([
                    getCookies("_fbp"),
                    getCookies("_ttp"),
                    getCookies("_fbc"),
                    getCookies("_ttclid"),
                    getCookies("utm_content"),
                    getCookies("utm_medium"),
                    getCookies("utm_source"),
                    getCookies("utm_campaign"),
                    getCookies("utm_term")
                ]);

                // Determine source based on utm_source (prioritas cookie dulu)
                const utmSource = (utmSourceCookie?.value || queryParams?.utm_source || "").toLowerCase();
                let source: string | null = null;
                
                switch (utmSource) {
                    case "fb":
                    case "facebook":
                        source = "meta_ads";
                        break;
                    case "tt":
                    case "tiktok":
                    case "ttads":
                        source = "tiktok_ads";
                        break;
                    default:
                        source = null;
                }

                // Build data object - PRIORITAS COOKIE DULU, fallback ke query params
                const eventParams: EventParamsData = {
                    // Tracking pixels (dari cookies saja)
                    fbp: fbpCookie?.value || null,
                    ttp: ttpCookie?.value || null,
                    
                    // Attribution (prioritas cookie dulu, fallback ke query params)
                    fbc: fbcCookie?.value || queryParams?.fbc || null,
                    ttclid: ttclidCookie?.value || queryParams?.ttclid || null,
                    
                    // UTM parameters (prioritas cookie dulu, fallback ke query params)
                    utm_content: utmContentCookie?.value || queryParams?.utm_content || null,
                    utm_medium: utmMediumCookie?.value || queryParams?.utm_medium || null,
                    utm_source: utmSourceCookie?.value || queryParams?.utm_source || null,
                    utm_campaign: utmCampaignCookie?.value || queryParams?.utm_campaign || null,
                    utm_term: utmTermCookie?.value || queryParams?.utm_term || null,

                    // Get ip and user agents data
                    ip_adress: null,
                    user_agent: null,

                    // Source berdasarkan utm_source
                    source: source,
                };

                if (mounted) {
                    setEventParamsData(eventParams);
                }
            } catch (err) {
                console.error('Error loading event params:', err);
                if (mounted) {
                    setError(err instanceof Error ? err.message : 'Failed to load event params');
                }
            }
        };

        loadEventParams();
        
        return () => {
            mounted = false;
        };
    }, [queryParams]);

    return {
        eventParamsData,
        getClidData,
        isLoading,
        error
    };
};