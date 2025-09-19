import { create } from 'zustand';

interface ParamsData {
    [key: string]: string | undefined;
}

interface ParamsDataStore {
    paramsData: ParamsData;
    setParamsData: (data: ParamsData) => void;
    getParamValue: (key: string) => string | undefined;
    clearParamsData: () => void;
    loadFromURL: () => void;
}

export const useGetParamsDataStore = create<ParamsDataStore>((set, get) => ({
    paramsData: {},
    
    loadFromURL: () => {
        const params: ParamsData = {};
        const search = window.location.search;
        if (search) {
            search.substring(1).split('&').forEach(param => {
                const [key, value] = param.split('=');
                if (key) {
                    params[decodeURIComponent(key)] = value ? decodeURIComponent(value) : '';
                }
            });
        }
        set({ paramsData: params });
    },
    
    setParamsData: (data: ParamsData) => {
        set({ paramsData: data });
    },
    
    getParamValue: (key: string) => {
        const state = get();
        // Jika paramsData kosong, load dari URL dulu
        if (Object.keys(state.paramsData).length === 0) {
            state.loadFromURL();
            return get().paramsData[key];
        }
        return state.paramsData[key];
    },
    
    clearParamsData: () => {
        set({ paramsData: {} });
    },
}));