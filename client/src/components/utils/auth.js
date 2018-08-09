export const isAuthenticated = () => {
    const auth = sessionStorage.getItem('auth');
    return auth > 0;
};
