import { useState, useEffect } from 'react';
import { PortraitState } from '../types';

export interface HistoryItem {
    id: string;
    timestamp: number;
    state: PortraitState;
    promptSignature?: string; // Short description or summary
    isFavorite: boolean;
}

const MAX_HISTORY = 50;

export const useHistory = () => {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [favorites, setFavorites] = useState<HistoryItem[]>([]);

    // Load from LocalStorage on mount
    useEffect(() => {
        try {
            const savedHistory = localStorage.getItem('ppm_history');
            const savedFavorites = localStorage.getItem('ppm_favorites');

            if (savedHistory) setHistory(JSON.parse(savedHistory));
            if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
        } catch (e) {
            console.error("Failed to load history", e);
        }
    }, []);

    // Save to LocalStorage whenever changes
    useEffect(() => {
        localStorage.setItem('ppm_history', JSON.stringify(history));
    }, [history]);

    useEffect(() => {
        localStorage.setItem('ppm_favorites', JSON.stringify(favorites));
    }, [favorites]);

    const addToHistory = (state: PortraitState) => {
        // Avoid duplicates: check if the new state is identical to the most recent one
        if (history.length > 0) {
            const lastItem = history[0];
            if (JSON.stringify(lastItem.state) === JSON.stringify(state)) {
                return; // Skip duplicate
            }
        }

        const newItem: HistoryItem = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            state: { ...state }, // Deep copy
            isFavorite: false
        };

        setHistory(prev => [newItem, ...prev].slice(0, MAX_HISTORY));
    };

    const toggleFavorite = (item: HistoryItem) => {
        const isAlreadyFav = favorites.some(f => f.id === item.id);

        if (isAlreadyFav) {
            // Remove from favorites
            setFavorites(prev => prev.filter(f => f.id !== item.id));
            // Update history item status if present there
            setHistory(prev => prev.map(h => h.id === item.id ? { ...h, isFavorite: false } : h));
        } else {
            // Add to favorites
            const favItem = { ...item, isFavorite: true };
            setFavorites(prev => [favItem, ...prev]);
            // Update history item status
            setHistory(prev => prev.map(h => h.id === item.id ? { ...h, isFavorite: true } : h));
        }
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('ppm_history');
    };

    const removeFavorite = (id: string) => {
        setFavorites(prev => prev.filter(f => f.id !== id));
        // Also update history to reflect un-favorited state
        setHistory(prev => prev.map(h => h.id === id ? { ...h, isFavorite: false } : h));
    };

    return {
        history,
        favorites,
        addToHistory,
        toggleFavorite,
        removeFavorite,
        clearHistory
    };
};
