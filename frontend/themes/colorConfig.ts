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

export const colorConfigLight = {
    primary: '#FB8C00', onPrimary: '#FFFFFF', primaryContainer: '#FFE0B2', onPrimaryContainer: '#4E2B00',
    secondary: '#FFA726', onSecondary: '#FFFFFF', secondaryContainer: '#FFECB3', onSecondaryContainer: '#4E2B00',
    tertiary: '#FFB74D', onTertiary: '#FFFFFF', tertiaryContainer: '#FFF3E0', onTertiaryContainer: '#4E2B00',
    error: '#D32F2F', onError: '#FFFFFF', errorContainer: '#F9DEDC', onErrorContainer: '#5B1212',
    background: '#FFF8F1', onBackground: '#1A1A1A', surface: '#FFFFFF', onSurface: '#1A1A1A',
    surfaceVariant: '#FFE5CC', onSurfaceVariant: '#664400',
    outline: '#CC9900',
}


export const colorConfigDark = {
    primary: '#FFB74D', onPrimary: '#3E1F00', primaryContainer: '#FF9800', onPrimaryContainer: '#FFF3E0',
    secondary: '#FFA726', onSecondary: '#3E1F00', secondaryContainer: '#FFB74D', onSecondaryContainer: '#FFF3E0',
    tertiary: '#FFCC80', onTertiary: '#3E1F00', tertiaryContainer: '#FFB74D', onTertiaryContainer: '#FFF3E0',
    error: '#EF5350', onError: '#370000', errorContainer: '#8C1D18', onErrorContainer: '#F9DEDC',
    background: '#2B1B0B', onBackground: '#FFEFD5',
    surface: '#3E2723', onSurface: '#FFEFD5',
    surfaceVariant: '#5D4037', onSurfaceVariant: '#D7CCC8',
    outline: '#B36B00',
}
