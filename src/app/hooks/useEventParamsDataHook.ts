import { useState, useEffect } from "react";
import { getCookies } from "./useCookiesData";
import { useQueryParamsDataStore } from "@/app/hooks/useQueryParamsDataStore";
import { EventParamsData } from "@/app/_backend/_utils/Interfaces";
import clidService from "../services/leadGetClidService"; // Pastikan path ini sesuai

export const useEventParamsData = (): { 
    eventParamsData: EventParamsData | null;
    getClidData: (phone_number: string) => Promise<void>;
} => {
    const { queryParams } = useQueryParamsDataStore();
    const [eventParamsData, setEventParamsData] = useState<EventParamsData | null>(null);

    const getClidData = async (phone_number: string, currentEventParams?: EventParamsData | null) => {
        // Jika fbc atau ttclid tidak ada, get dari lead service
        if (!currentEventParams?.fbc || !currentEventParams?.ttclid) {
            console.log('Clid not detected. Fetching clid data for phone number:', phone_number);
            const result = await clidService.getClid({ phone_number });

            // Jika response result contain fb maka simpan di _fbc cookie, jika ttclid simpan di _ttclid cookie
            if (result) {
                if (result.data.clid.source === 'meta_ads') {
                    document.cookie = `_fbc=${result.data.clid.id}; path=/; max-age=${60 * 60 * 24 * 90}`; // 90 days
                    document.cookie = `utm_source=FB; path=/; max-age=${60 * 60 * 24 * 90}`; // 90 days
                    console.log('FBC Cookie set:', result.data.clid.id);
                    console.log('UTM Source set: FB');
                }
                if (result.data.clid.source === 'tiktok_ads') {
                    document.cookie = `_ttclid=${result.data.clid.id}; path=/; max-age=${60 * 60 * 24 * 90}`; // 90 days
                    document.cookie = `utm_source=TTADS; path=/; max-age=${60 * 60 * 24 * 90}`; // 90 days
                    console.log('TTCLID Cookie set:', result.data.clid.id);
                    console.log('UTM Source set: TTADS');
                }
            }
        }
    };

    useEffect(() => {
        let mounted = true;

        const loadEventParams = async () => {
            // Get cookies
            const fbpCookie = await getCookies("_fbp");
            const ttpCookie = await getCookies("_ttp");
            const fbcCookie = await getCookies("_fbc");
            const ttclidCookie = await getCookies("_ttclid");
            const utmContentCookie = await getCookies("utm_content");
            const utmMediumCookie = await getCookies("utm_medium");
            const utmSourceCookie = await getCookies("utm_source");
            const utmCampaignCookie = await getCookies("utm_campaign");
            const utmTermCookie = await getCookies("utm_term");

            // Determine source based on utm_source
            const utmSource = (queryParams?.utm_source || utmSourceCookie?.value || "").toLowerCase();
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

            // Build data object
            const eventParams: EventParamsData = {
                // Tracking pixels (dari cookies saja)
                fbp: fbpCookie?.value || null,
                ttp: ttpCookie?.value || null,
                
                // Attribution (prioritas dari query params, fallback ke cookies)
                fbc: queryParams?.fbc || fbcCookie?.value || null,
                ttclid: queryParams?.ttclid || ttclidCookie?.value || null,
                
                // UTM parameters (prioritas dari query params, fallback ke cookies)
                utm_content: queryParams?.utm_content || utmContentCookie?.value || null,
                utm_medium: queryParams?.utm_medium || utmMediumCookie?.value || null,
                utm_source: queryParams?.utm_source || utmSourceCookie?.value || null,
                utm_campaign: queryParams?.utm_campaign || utmCampaignCookie?.value || null,
                utm_term: queryParams?.utm_term || utmTermCookie?.value || null,

                // Get ip and user agents data
                ip_adress: null,
                user_agent: null,

                // Source berdasarkan utm_source
                source: source,
            };

            if (mounted) {
                setEventParamsData(eventParams);
            }
        };

        loadEventParams();
        
        return () => {
            mounted = false;
        };
    }, [queryParams]);

    // Expose getClidData function untuk digunakan di komponen lain
    // Bisa juga ditambahkan ke return value jika perlu dipanggil dari luar
    useEffect(() => {
        if (eventParamsData) {
            // Simpan fungsi getClidData ke window atau context jika diperlukan
            (window as any).getClidData = (phone_number: string) => 
                getClidData(phone_number, eventParamsData);
        }
    }, [eventParamsData]);

    return {
        eventParamsData,
        getClidData: async (phone_number: string) => {
            return getClidData(phone_number, eventParamsData);
        }
    };
};