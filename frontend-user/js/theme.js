/* ========================================
   设计变量读取层（与 css/variables.css 同源）
   ----------------------------------------
   JS 无法直接使用 CSS 变量的地方（ECharts 配置、动态样式）
   统一通过 THEME 读取：
     · THEME.get('--color-primary', '#a855f7')
     · THEME.rgba('--color-primary-rgb', 0.4)
   变量未定义 / variables.css 未加载时，回退到内置默认值，
   不会把空字符串传给图表或内联样式。
   ======================================== */

(function (global) {
    // 与 css/variables.css 保持一致的默认值（仅在变量缺失时使用）
    var FALLBACKS = {
        '--color-primary': '#a855f7',
        '--color-primary-rgb': '168, 85, 247',
        '--color-accent': '#ec4899',
        '--color-accent-rgb': '236, 72, 153',
        '--color-highlight': '#06b6d4',
        '--color-highlight-rgb': '6, 182, 212',
        '--color-success': '#10b981',
        '--color-success-rgb': '16, 185, 129',
        '--color-danger': '#ef4444',
        '--color-danger-rgb': '239, 68, 68',
        '--color-warning': '#f59e0b',
        '--color-warning-rgb': '245, 158, 11',
        '--color-info': '#3b82f6',
        '--color-info-rgb': '59, 130, 246',
        '--color-white': '#ffffff',
        '--color-white-rgb': '255, 255, 255',
        '--color-black': '#000000',
        '--color-black-rgb': '0, 0, 0',
        '--bg-surface-strong': 'rgba(20, 20, 35, 0.95)',
        '--border-glass': 'rgba(168, 85, 247, 0.3)',
        '--text-strong': '#f8fafc',
        '--text-base': '#94a3b8'
    };

    var cache = {};

    function read(name, fallback) {
        if (Object.prototype.hasOwnProperty.call(cache, name)) return cache[name];
        var value = '';
        if (global.getComputedStyle && global.document) {
            value = (global.getComputedStyle(global.document.documentElement)
                .getPropertyValue(name) || '').trim();
        }
        // 空值或引用了未解析的 var(...) 时回退，避免出现空白样式
        if (!value || /var\(/.test(value)) {
            value = fallback || FALLBACKS[name] || '';
        }
        cache[name] = value;
        return value;
    }

    // 取原始变量值（带默认值回退）
    function get(name, fallback) {
        return read(name, fallback);
    }

    // 由 “r, g, b” 通道变量派生 rgba；通道缺失时使用 fallbackRgb
    function rgba(rgbVarName, alpha, fallbackRgb) {
        var channels = read(rgbVarName, fallbackRgb);
        if (!channels) channels = fallbackRgb || '0, 0, 0';
        return 'rgba(' + channels + ', ' + alpha + ')';
    }

    global.THEME = { get: get, rgba: rgba, _fallbacks: FALLBACKS };
})(window);
