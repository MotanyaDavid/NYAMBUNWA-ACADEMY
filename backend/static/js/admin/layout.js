// ============================================
// NYAMBUNWA ACADEMY ADMIN
// layout.js - Layout interactions
// ============================================

(function () {
    'use strict';
    
    const html = document.documentElement;
    const layout = document.querySelector('.app-layout');
    const sidebar = document.querySelector('.sidebar');
    const drawerOverlay = document.getElementById('drawer-overlay');
    
    // ============================================
    // THEME
    // ============================================
    function initTheme() {
        const saved = localStorage.getItem('admin-theme') || 'light';
        html.setAttribute('data-theme', saved);
        updateThemeIcons(saved);
    }
    
    function toggleTheme() {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('admin-theme', next);
        updateThemeIcons(next);
    }
    
    function updateThemeIcons(theme) {
        document.querySelectorAll('[data-theme-icon]').forEach(function (icon) {
            icon.style.display = icon.getAttribute('data-theme-icon') === theme ? 'block' : 'none';
        });
    }
    
    // ============================================
    // SIDEBAR COLLAPSE (Desktop)
    // ============================================
    function initSidebarCollapse() {
        if (!layout) return;
        
        const saved = localStorage.getItem('admin-sidebar-collapsed');
        if (saved === 'true' && window.innerWidth > 768) {
            layout.classList.add('is-sidebar-collapsed');
        }
        
        const collapseBtn = document.getElementById('sidebar-collapse');
        if (collapseBtn) {
            collapseBtn.addEventListener('click', function () {
                layout.classList.toggle('is-sidebar-collapsed');
                const collapsed = layout.classList.contains('is-sidebar-collapsed');
                localStorage.setItem('admin-sidebar-collapsed', collapsed);
            });
        }
    }
    
    // ============================================
    // MOBILE SIDEBAR DRAWER
    // ============================================
    function initMobileDrawer() {
        const menuBtn = document.getElementById('topbar-menu');
        
        if (menuBtn && sidebar) {
            menuBtn.addEventListener('click', function () {
                sidebar.classList.toggle('is-open');
                if (drawerOverlay) {
                    drawerOverlay.classList.toggle('is-open');
                }
            });
        }
        
        if (drawerOverlay) {
            drawerOverlay.addEventListener('click', function () {
                sidebar.classList.remove('is-open');
                drawerOverlay.classList.remove('is-open');
            });
        }
    }
    
    // ============================================
    // USER MENU DROPDOWN
    // ============================================
    function initDropdowns() {
        document.querySelectorAll('[data-dropdown-trigger]').forEach(function (trigger) {
            const dropdownId = trigger.getAttribute('data-dropdown-trigger');
            const dropdown = document.getElementById(dropdownId);
            if (!dropdown) return;
            
            trigger.addEventListener('click', function (e) {
                e.stopPropagation();
                document.querySelectorAll('.dropdown.is-open').forEach(function (d) {
                    if (d !== dropdown) d.classList.remove('is-open');
                });
                dropdown.classList.toggle('is-open');
            });
        });
        
        document.addEventListener('click', function () {
            document.querySelectorAll('.dropdown.is-open').forEach(function (d) {
                d.classList.remove('is-open');
            });
        });
    }
    
    // ============================================
    // COMMAND PALETTE
    // ============================================
    function initCommandPalette() {
        const overlay = document.getElementById('command-overlay');
        const input = document.getElementById('command-input');
        const list = document.getElementById('command-list');
        if (!overlay || !input || !list) return;
        
        let activeIndex = 0;
        let filteredItems = [];
        
        function getAllItems() {
            return Array.from(list.querySelectorAll('.command-item'));
        }
        
        function openPalette() {
            overlay.classList.add('is-open');
            input.value = '';
            input.focus();
            filterItems('');
            activeIndex = 0;
            updateActive();
        }
        
        function closePalette() {
            overlay.classList.remove('is-open');
            input.value = '';
        }
        
        function filterItems(query) {
            const items = getAllItems();
            const q = query.toLowerCase().trim();
            
            items.forEach(function (item) {
                const text = item.getAttribute('data-command-text') || item.textContent;
                const matches = !q || text.toLowerCase().includes(q);
                item.style.display = matches ? 'flex' : 'none';
            });
            
            filteredItems = items.filter(function (item) {
                return item.style.display !== 'none';
            });
            
            if (filteredItems.length === 0) {
                activeIndex = 0;
            } else if (activeIndex >= filteredItems.length) {
                activeIndex = filteredItems.length - 1;
            }
            
            updateActive();
        }
        
        function updateActive() {
            filteredItems.forEach(function (item, i) {
                item.classList.toggle('is-active', i === activeIndex);
            });
        }
        
        function navigate(direction) {
            if (filteredItems.length === 0) return;
            activeIndex = (activeIndex + direction + filteredItems.length) % filteredItems.length;
            updateActive();
            filteredItems[activeIndex].scrollIntoView({ block: 'nearest' });
        }
        
        function selectActive() {
            if (filteredItems[activeIndex]) {
                filteredItems[activeIndex].click();
                closePalette();
            }
        }
        
        input.addEventListener('input', function () {
            activeIndex = 0;
            filterItems(this.value);
        });
        
        input.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                navigate(1);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                navigate(-1);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                selectActive();
            } else if (e.key === 'Escape') {
                closePalette();
            }
        });
        
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) closePalette();
        });
        
        // Global shortcuts
        document.addEventListener('keydown', function (e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                openPalette();
            } else if (e.key === '/' && !isInputFocused()) {
                e.preventDefault();
                openPalette();
            } else if (e.key === 'Escape') {
                if (overlay.classList.contains('is-open')) closePalette();
            }
        });
        
        // Triggers
        document.querySelectorAll('[data-open-command]').forEach(function (btn) {
            btn.addEventListener('click', openPalette);
        });
        
        // Handle item click
list.addEventListener('click', function (e) {
    const item = e.target.closest('.command-item');
    if (!item) return;
    
    // Navigation
    const url = item.getAttribute('data-url');
    if (url) {
        window.location.href = url;
        return;
    }
    
    // Actions
    const action = item.getAttribute('data-action');
    if (action === 'toggle-theme') {
        toggleTheme();
    }
    
    closePalette();
});
    }
    
    function isInputFocused() {
        const el = document.activeElement;
        return el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable);
    }
    
    // ============================================
    // THEME TOGGLE TRIGGERS
    // ============================================
    document.querySelectorAll('[data-toggle-theme]').forEach(function (btn) {
        btn.addEventListener('click', toggleTheme);
    });
    
    // ============================================
    // INIT
    // ============================================
    function init() {
        initTheme();
        initSidebarCollapse();
        initMobileDrawer();
        initDropdowns();
        initCommandPalette();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();