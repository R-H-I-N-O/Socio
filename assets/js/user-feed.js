document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("sidebar");
    const friendsList = document.getElementById("friends-list");
    const toggleSidebar = document.getElementById("toggle-sidebar");
    const closeSidebar = document.getElementById("close-sidebar");
    const toggleFriendsList = document.getElementById("toggle-friends-list");
    const closeFriendsList = document.getElementById("close-friends-list");
    const toggleMenu = document.getElementById("toggle-menu");
    const menu = document.getElementById("header-menu");
    const closemenu = document.getElementById("close-header-menu");



    // toggle menu
    toggleMenu.addEventListener("click", () => {
        menu.style.display = "flex";
        sidebar.style.display = "none";
        friendsList.style.display = "none";
    });
    
    closemenu.addEventListener("click", () => {
        menu.style.display = "none";
    });

    // Toggle Sidebar
    toggleSidebar.addEventListener("click", () => {
        sidebar.style.display = "flex";
        friendsList.style.display = "none";
        menu.style.display = "none";
    });

    closeSidebar.addEventListener("click", () => {
        sidebar.style.display = "none";
    });

    // Toggle Friends List
    toggleFriendsList.addEventListener("click", () => {
        friendsList.style.display = "flex";
        sidebar.style.display = "none";
        menu.style.display = "none";
    });

    closeFriendsList.addEventListener("click", () => {
        friendsList.style.display = "none";
    });
});
