// Global Stats Configuration
const SUPABASE_URL = "PROJEhttps://bsezoupqzkhtkkdcqxag.supabase.coCT_URL"; // Fill these in Supabase Settings
const SUPABASE_ANON_KEY = "PROJsb_publishable_jHL6hBdb4GQtK8Dl7Rp38g_0RsFnPM9ECT_KEY";

const headers = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
};

export const saveGlobalStat = async (stat) => {
    if (SUPABASE_URL === "PROhttps://bsezoupqzkhtkkdcqxag.supabase.coJECT_URL") {
        console.warn("Supabase keys not set. Saving to local storage only.");
        return;
    }
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/love_stats`, {
            method: 'POST',
            headers,
            body: JSON.stringify(stat)
        });
        return await response.json();
    } catch (error) {
        console.error("Error saving global stat:", error);
    }
};

export const fetchGlobalStats = async () => {
    if (SUPABASE_URL === "PROhttps://bsezoupqzkhtkkdcqxag.supabase.coJECT_URL") {
        return null;
    }
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/love_stats?order=created_at.desc`, {
            method: 'GET',
            headers
        });
        return await response.json();
    } catch (error) {
        console.error("Error fetching global stats:", error);
        return null;
    }
};
