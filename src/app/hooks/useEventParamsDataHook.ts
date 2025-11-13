import { useState, useEffect } from "react";
import { getCookies } from "./useCookiesData";
import { useQueryParamsDataStore } from "@/app/hooks/useQueryParamsDataStore";

export interface EventParamsData {
    fbp: string | null;
    fbc: string | null;
    ttclid: string | null;
    ttp: string | null;
    utm_content: string | null;
    utm_medium: string | null;
    utm_source: string | null;
    utm_campaign: string | null;
    utm_term: string | null;
    ip_adress: string | null;
    user_agent: string | null;
}

export const useEventParamsData = (): EventParamsData | null => {
    const { queryParams } = useQueryParamsDataStore();
    const [eventParamsData, setEventParamsData] = useState<EventParamsData | null>(null);

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

                // get ip and user agents data
                ip_adress: null,
                user_agent: null,
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

    return eventParamsData;
};