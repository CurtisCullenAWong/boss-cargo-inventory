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
    deepNavy:   '#082F57', // Brand anchor / strongest color
    slateBlue:  '#264673', // Primary surface / container tone
    darkSlate:  '#1E293B', // Main dark neutral
    midSlate:   '#334155', // Secondary neutral
    softSlate:  '#68778B', // Muted text / outlines
};

// =======================================
//  Light Color Scheme
// =======================================
export const colorConfigLight = {
    // Primary
    primary:            BASE.deepNavy,
    onPrimary:          '#FFFFFF',
    primaryContainer:   BASE.slateBlue,
    onPrimaryContainer: '#FFFFFF',

    // Secondary
    secondary:            BASE.midSlate,
    onSecondary:          '#FFFFFF',
    secondaryContainer:   '#D8E0EA',
    onSecondaryContainer: BASE.darkSlate,

    // Tertiary
    tertiary:            '#334155',
    onTertiary:          '#FFFFFF',
    tertiaryContainer:   '#E2E8F0',
    onTertiaryContainer: BASE.darkSlate,

    // Error (unchanged for accessibility)
    error:               '#D32F2F',
    onError:             '#FFFFFF',
    errorContainer:      '#F9DEDC',
    onErrorContainer:    '#5B1212',

    // Surfaces
    background:          '#F8FAFC',
    onBackground:        BASE.darkSlate,

    surface:             '#FFFFFF',
    onSurface:           BASE.darkSlate,

    surfaceVariant:      '#E5EAF0',
    onSurfaceVariant:    BASE.midSlate,

    // Outline / borders
    outline:             BASE.softSlate,
};


// =======================================
//  Dark Color Scheme
// =======================================
export const colorConfigDark = {
    // Primary
    primary:            '#4F83C2',       // Lifted blue for contrast
    onPrimary:          '#FFFFFF',
    primaryContainer:   BASE.deepNavy,
    onPrimaryContainer: '#E6F0FF',

    // Secondary
    secondary:            BASE.midSlate,
    onSecondary:          '#FFFFFF',
    secondaryContainer:   BASE.slateBlue,
    onSecondaryContainer: '#E6F0FF',

    // Tertiary
    tertiary:            '#68778B',
    onTertiary:          '#FFFFFF',
    tertiaryContainer:   '#2A3A4F',
    onTertiaryContainer: '#E6EAF0',

    // Error
    error:               '#D32F2F',
    onError:             '#FFFFFF',
    errorContainer:      '#F9DEDC',
    onErrorContainer:    '#5B1212',

    // Surfaces
    background:          BASE.darkSlate,
    onBackground:        '#E5EAF0',

    surface:             '#243044',
    onSurface:           '#E5EAF0',

    surfaceVariant:      '#2F3E55',
    onSurfaceVariant:    BASE.softSlate,

    // Outline
    outline:             BASE.softSlate,
};
