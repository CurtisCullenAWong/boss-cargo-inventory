/*  Descriptions:
background — The main background color of the app, typically used for the overall page background.
onBackground — Text or icon color used for elements placed on the background, ensuring sufficient contrast for readability.

surface — The background color for UI containers and elements that need to stand out against the background.
onSurface — Text or icon color used for elements on surfaces, ensuring sufficient contrast for readability.

primary — The color for key elements like buttons, links, and highlights that need to stand out in the UI.
onPrimary — Text or icon color used for elements on primary-colored backgrounds, ensuring good contrast for readability.
primaryContainer — The background color for containers that highlight primary elements (e.g., button containers).
onPrimaryContainer — Text or icon color used on primary containers, ensuring sufficient contrast for visibility.

secondary — The color for secondary UI elements, such as secondary buttons or accent elements.
onSecondary — Text or icon color used on secondary-colored elements, ensuring good contrast for visibility.
secondaryContainer — The background color for containers holding secondary elements.
onSecondaryContainer — Text or icon color used on secondary containers to ensure proper contrast.

tertiary — The color for less prominent elements, usually used for accents or tertiary actions.
onTertiary — Text or icon color used for elements on tertiary-colored backgrounds for contrast.
tertiaryContainer — The background color for containers that hold tertiary elements.
onTertiaryContainer — Text or icon color used on tertiary containers for readability and contrast.

error — The background color for error messages and alerts to indicate problems.
onError — Text color used on elements within error-colored backgrounds for contrast and readability.
errorContainer — The background color used for containers that display error messages.
onErrorContainer — Text or icon color used on error containers, ensuring readability against error backgrounds.

surfaceVariant — A background color alternative to the main surface color, often used for inputs or forms.
onSurfaceVariant — Text or icon color used for elements on surface variant backgrounds to maintain contrast.

outline — The color used for borders and dividers, providing subtle separation between UI elements.
*/

// =======================================
//  Brand Base Tokens
// =======================================
const BASE = {
    lightGold: '#FEE000',     // Primary brand color
    sandGold:  '#FDEE7E',     // Secondary / supporting
    darkGray:  '#292929',     // Main neutral (dark)
    midGray:   '#787171',     // Secondary neutral
};

// =======================================
//  Light Color Scheme
// =======================================
export const colorConfigLight = {
    // Primary
    primary:            BASE.lightGold,
    onPrimary:          BASE.darkGray,
    primaryContainer:   BASE.sandGold,
    onPrimaryContainer: BASE.darkGray,

    // Secondary
    secondary:            BASE.sandGold,
    onSecondary:          BASE.darkGray,
    secondaryContainer:   '#FFF9C2',     
    onSecondaryContainer: BASE.darkGray,

    // Tertiary (variant of primary)
    tertiary:            BASE.lightGold,
    onTertiary:          BASE.darkGray,
    tertiaryContainer:   '#FFF4A6',     
    onTertiaryContainer: BASE.darkGray,

    // Error (kept red for accessibility)
    error:               '#D32F2F',
    onError:             '#FFFFFF',
    errorContainer:      '#F9DEDC',
    onErrorContainer:    '#5B1212',
    // Surfaces
    background:          '#FFFEF7',      
    onBackground:        BASE.darkGray,
    surface:             '#FFFFFF',
    onSurface:           BASE.darkGray,
    surfaceVariant:      '#FAF4D7',      
    onSurfaceVariant:    BASE.midGray,
    // Outline / borders
    outline:             BASE.midGray,
};


// =======================================
//  Dark Color Scheme
// =======================================
export const colorConfigDark = {
    // Primary
    primary:            '#FEE85A',      
    onPrimary:          BASE.darkGray,
    primaryContainer:   '#C7B200',      
    onPrimaryContainer: '#FFF9D9',

    // Secondary
    secondary:            BASE.sandGold,
    onSecondary:          BASE.darkGray,
    secondaryContainer:   '#C7B763',    
    onSecondaryContainer: '#FFF9D9',

    // Tertiary (variant)
    tertiary:            '#FEE85A',
    onTertiary:          BASE.darkGray,
    tertiaryContainer:   '#C7B200',
    onTertiaryContainer: '#FFF9D9',

    // Error
    error:               '#EF5350',
    onError:             '#370000',
    errorContainer:      '#8C1D18',
    onErrorContainer:    '#F9DEDC',

    // Surfaces
    background:          '#1A1A1A',     
    onBackground:        '#F2F2F2',

    surface:             BASE.darkGray,
    onSurface:           '#F2F2F2',

    surfaceVariant:      '#3A3A3A',
    onSurfaceVariant:    '#C0C0C0',

    // Outline
    outline:             BASE.midGray,
};
