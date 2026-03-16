import { storeSettingsAPI } from '../../api/store.api.js';
import { setStoreSettings, setLoading, setError } from '../slice/storeSettingsSlice.js';

export const getStoreSettings = ({ force = false } = {}) => async (dispatch, getState) => {
    const { storeSettings } = getState();

    if (!force && (storeSettings.loading || storeSettings.hasLoaded)) {
        return storeSettings;
    }

    try {
        dispatch(setLoading(true));
        const response = await storeSettingsAPI.getStoreSettings();
        dispatch(setStoreSettings(response));
        return response;
    } catch (error) {
        dispatch(setError(error.response?.data?.detail || error.message || 'Failed to fetch store settings'));
        throw error;
    }
};
