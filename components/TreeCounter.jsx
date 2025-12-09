import { useEffect, useRef, useState } from 'react';

// Constants
const DEFAULT_PLACEHOLDER_URL = 'YOUR_WIDGET_URL';

// Style constants for better maintainability
const ERROR_CONTAINER_STYLE = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  padding: '20px',
  textAlign: 'center',
  backgroundColor: '#fef2f2',
  color: '#dc2626'
};

/**
 * TreeCounter Component
 * 
 * A React component that embeds the Plant-for-the-Planet tree counter widget.
 * Displays real-time tree planting progress from the Trillion Tree Campaign.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} [props.widgetUrl='YOUR_WIDGET_URL'] - The URL of your Plant-for-the-Planet widget
 * @param {number} [props.width=400] - Width of the widget container in pixels
 * @param {number} [props.height=300] - Height of the widget iframe in pixels
 * @param {string} [props.borderRadius='8px'] - Border radius for rounded corners
 * @param {string} [props.className=''] - Optional custom CSS class name
 * @param {boolean} [props.showInfo=true] - Show/hide the information section below the widget
 * 
 * @example
 * ```jsx
 * <TreeCounter 
 *   widgetUrl="https://www.plant-for-the-planet.org/treecounter/YOUR_PROFILE_NAME"
 *   width={400}
 *   height={300}
 * />
 * ```
 */
export function TreeCounter({
  widgetUrl = DEFAULT_PLACEHOLDER_URL,
  width = 400,
  height = 300,
  borderRadius = '8px',
  className = '',
  showInfo = true
}) {
  const iframeRef = useRef(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Effect to set up the iframe when the component mounts or widgetUrl changes
   */
  useEffect(() => {
    // Check if widget URL is properly configured
    if (widgetUrl === DEFAULT_PLACEHOLDER_URL || !widgetUrl) {
      setIsConfigured(false);
      setError('Widget URL not configured. Please provide a valid widget URL.');
      return;
    }

    // Validate URL format
    try {
      new URL(widgetUrl);
      setIsConfigured(true);
      setError(null);
    } catch (err) {
      setIsConfigured(false);
      setError('Invalid widget URL format. Please check your configuration.');
      console.error('TreeCounter: Invalid URL', err);
    }
  }, [widgetUrl]);

  /**
   * Separate effect to set iframe src when configured state changes
   */
  useEffect(() => {
    // Set iframe src if reference exists and widget is configured
    if (iframeRef.current && isConfigured && widgetUrl) {
      iframeRef.current.src = widgetUrl;
    }
  }, [isConfigured, widgetUrl]);

  return (
    <div className={`tree-counter-wrapper ${className}`}>
      {/* Widget Container */}
      <div 
        style={{
          maxWidth: `${width}px`,
          width: '100%',
          margin: '0 auto'
        }}
      >
        {/* Title */}
        <h2 
          style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#065f46',
            marginBottom: '12px',
            textAlign: 'center'
          }}
        >
          🌳 Tree Counter Widget
        </h2>

        {/* Description */}
        <p 
          style={{
            fontSize: '14px',
            color: '#047857',
            marginBottom: '20px',
            textAlign: 'center',
            lineHeight: '1.6'
          }}
        >
          Join the global movement to plant 1 trillion trees!
        </p>

        {/* Widget Frame Container */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: `${height}px`,
            borderRadius,
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            backgroundColor: '#f0fdf4'
          }}
        >
          {isConfigured ? (
            <iframe
              ref={iframeRef}
              title="Plant for the Planet Tree Counter"
              width="100%"
              height={height}
              scrolling="no"
              loading="lazy"
              allow="encrypted-media"
              style={{
                border: 'none',
                borderRadius,
                width: '100%',
                height: '100%'
              }}
            />
          ) : (
            /* Error or Configuration Required Message */
            <div style={ERROR_CONTAINER_STYLE}>
              <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                ⚠️ Configuration Required
              </p>
              <p style={{ fontSize: '12px', margin: 0 }}>
                {error || 'Please provide a valid widget URL'}
              </p>
            </div>
          )}
        </div>

        {/* Information Section */}
        {showInfo && (
          <div
            style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#f0fdf4',
              borderRadius: '8px',
              borderLeft: '4px solid #10b981'
            }}
          >
            <h3
              style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#065f46',
                marginTop: 0,
                marginBottom: '8px'
              }}
            >
              About the Widget
            </h3>
            <p
              style={{
                fontSize: '13px',
                color: '#047857',
                margin: 0,
                lineHeight: '1.5'
              }}
            >
              This counter automatically updates to show the latest tree planting progress. 
              To get your own widget, visit{' '}
              <a
                href="https://widgets.plant-for-the-planet.org"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#059669',
                  fontWeight: '500',
                  textDecoration: 'none'
                }}
              >
                widgets.plant-for-the-planet.org
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TreeCounter;
