import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useFarmStore = create(
  persist(
    (set) => ({
      farms: [],

      addFarm: (farm) => set((state) => ({
        farms: [
          ...state.farms,
          {
            ...farm,
            id: crypto.randomUUID(),
            createdAt: Date.now(),
            items: [] // Initial empty list of items
          }
        ]
      })),

      addItemToFarm: (farmId, item) => set((state) => ({
        farms: state.farms.map((farm) => {
          if (farm.id === farmId) {
            // Check if item already exists to sum quantities
            const existingItemIndex = farm.items.findIndex(i => i.id === item.id);
            if (existingItemIndex >= 0) {
              const updatedItems = [...farm.items];
              const existing = updatedItems[existingItemIndex];

              const newStacks = existing.stacks + item.stacks;
              const newQuantity = existing.quantity + item.quantity;

              // Normalize if quantity exceeds 64
              const normalizedStacks = newStacks + Math.floor(newQuantity / 64);
              const normalizedQuantity = newQuantity % 64;

              updatedItems[existingItemIndex] = {
                ...existing,
                stacks: normalizedStacks,
                quantity: normalizedQuantity
              };

              return { ...farm, items: updatedItems };
            }

            // New item
            return {
              ...farm,
              items: [...farm.items, { ...item, isCollected: false }]
            };
          }
          return farm;
        })
      })),

      updateFarm: (farmId, updates) => set((state) => ({
        farms: state.farms.map((farm) =>
          farm.id === farmId ? { ...farm, ...updates } : farm
        )
      })),

      deleteFarm: (farmId) => set((state) => ({
        farms: state.farms.filter((farm) => farm.id !== farmId)
      })),

      updateItemInFarm: (farmId, itemId, updates) => set((state) => ({
        farms: state.farms.map((farm) => {
          if (farm.id === farmId) {
            return {
              ...farm,
              items: farm.items.map(item =>
                item.id === itemId
                  ? {
                    ...item,
                    ...updates,
                    // Re-normalize if stacks/quantity are updated
                    stacks: updates.stacks !== undefined
                      ? updates.stacks + Math.floor((updates.quantity || 0) / 64)
                      : item.stacks,
                    quantity: updates.quantity !== undefined
                      ? updates.quantity % 64
                      : item.quantity
                  }
                  : item
              )
            };
          }
          return farm;
        })
      })),

      deleteItemFromFarm: (farmId, itemId) => set((state) => ({
        farms: state.farms.map((farm) => {
          if (farm.id === farmId) {
            return {
              ...farm,
              items: farm.items.filter(item => item.id !== itemId)
            };
          }
          return farm;
        })
      })),

      toggleItemCollected: (farmId, itemId) => set((state) => ({
        farms: state.farms.map((farm) => {
          if (farm.id === farmId) {
            return {
              ...farm,
              items: farm.items.map(item =>
                item.id === itemId ? { ...item, isCollected: !item.isCollected } : item
              )
            };
          }
          return farm;
        })
      }))
    }),
    {
      name: 'minecraft-farm-storage',
    }
  )
);

export default useFarmStore;
