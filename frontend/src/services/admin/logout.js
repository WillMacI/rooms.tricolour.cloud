// frontend/src/services/logout.js
const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('organization');
    window.location.href = '/admin/login';
};

export default logout;