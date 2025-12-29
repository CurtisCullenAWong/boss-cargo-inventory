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
outlineVariant — A variant of outline color, typically lighter or more subtle, used for less prominent borders and dividers.
*/

// =======================================
//  Brand Base Tokens
// =======================================
const BASE = {
    darkSlate: '#1E293B',   // PRIMARY
    midSlate:  '#334155',   // SECONDARY
    blue:      '#0073C2',   // TERTIARY / ACCENT
    softLight: '#F8F0F0',   // LIGHT NEUTRAL
};
  

// =======================================
//  Light Color Scheme
// =======================================
export const colorConfigLight = {
    // Primary
    primary:            BASE.darkSlate,
    onPrimary:          '#FFFFFF',
    primaryContainer:   '#E2E8F0',
    onPrimaryContainer: BASE.darkSlate,

    // Secondary
    secondary:            BASE.midSlate,
    onSecondary:          '#FFFFFF',
    secondaryContainer:   '#CBD5E1',
    onSecondaryContainer: BASE.darkSlate,

    // Tertiary (Accent / Actions)
    tertiary:            BASE.blue,
    onTertiary:          '#FFFFFF',
    tertiaryContainer:   '#D6E9F7',
    onTertiaryContainer: BASE.darkSlate,

    // Error
    error:               '#D32F2F',
    onError:             '#FFFFFF',
    errorContainer:      '#F9DEDC',
    onErrorContainer:    '#5B1212',

    // Surfaces
    background:          BASE.softLight,
    onBackground:        BASE.darkSlate,

    surface:             '#FFFFFF',
    onSurface:           BASE.darkSlate,

    surfaceVariant:      '#F1F5F9',
    onSurfaceVariant:    BASE.midSlate,

    // Outline
    outline:             '#CBD5E1',
    outlineVariant:      '#E2E8F0',
};
  
// =======================================
//  Dark Color Scheme
// =======================================
export const colorConfigDark = {
    // Primary
    primary:            BASE.darkSlate,
    onPrimary:          '#F1F5F9',
    primaryContainer:   '#0F172A',
    onPrimaryContainer: '#E2E8F0',
  
    // Secondary
    secondary:            BASE.midSlate,
    onSecondary:          '#F1F5F9',
    secondaryContainer:   '#1F2937',
    onSecondaryContainer: '#E2E8F0',
  
    // Tertiary (Accent)
    tertiary:            '#4DA3E0',       // lifted blue for contrast
    onTertiary:          '#000000',        // white for better contrast on light blue
    tertiaryContainer:   BASE.blue,
    onTertiaryContainer: '#EAF4FB',
  
    // Error
    error:               '#EF5350',
    onError:             '#000000',
    errorContainer:      '#5F1D1D',
    onErrorContainer:    '#FDECEC',
  
    // Surfaces
    background:          '#0B1220',
    onBackground:        '#F1F5F9',
  
    surface:             '#0F172A',
    onSurface:           '#F1F5F9',
  
    surfaceVariant:      BASE.midSlate,
    onSurfaceVariant:    '#CBD5E1',
  
    // Outline
    outline:             '#475569',
    outlineVariant:      '#334155',
  };
  