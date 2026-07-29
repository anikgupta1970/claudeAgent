export const updateGlobalState = async (data: any) => {
    console.log('Mock PUT request to update global state:', data);
    return new Promise((resolve) => setTimeout(resolve, 500));
};
