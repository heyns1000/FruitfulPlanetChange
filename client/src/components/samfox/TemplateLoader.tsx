import { useEffect, useRef, useState } from 'react';

interface TemplateLoaderProps {
  category: 'master' | 'payment' | 'marketplace' | 'dashboards' | 'infrastructure' | 'heritage' | 'components' | 'sectors';
  template: string;
  className?: string;
  onLoad?: (html: string) => void;
  onError?: (error: Error) => void;
}

/**
 * TemplateLoader - Load SamFox HTML templates dynamically
 * 
 * Loads HTML templates from public/samfox-templates/ directory
 * and renders them in a React component.
 * 
 * @param category - Template category folder
 * @param template - Template filename
 * @param className - Optional CSS class for container
 * @param onLoad - Callback when template loads successfully
 * @param onError - Callback when template fails to load
 */
export function TemplateLoader({ 
  category, 
  template, 
  className = '',
  onLoad,
  onError 
}: TemplateLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/samfox-templates/${category}/${template}`);
        
        if (!response.ok) {
          throw new Error(`Failed to load template: ${response.statusText}`);
        }

        const html = await response.text();
        
        if (containerRef.current) {
          containerRef.current.innerHTML = html;
          
          // Execute any inline scripts in the template
          const scripts = containerRef.current.querySelectorAll('script');
          scripts.forEach((oldScript) => {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach(attr => {
              newScript.setAttribute(attr.name, attr.value);
            });
            newScript.textContent = oldScript.textContent;
            oldScript.parentNode?.replaceChild(newScript, oldScript);
          });
        }

        onLoad?.(html);
        setLoading(false);
      } catch (err) {
        const error = err as Error;
        setError(error.message);
        onError?.(error);
        setLoading(false);
      }
    };

    loadTemplate();
  }, [category, template, onLoad, onError]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading template...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-200 bg-red-50 p-4 rounded-md">
        <h3 className="text-red-800 font-semibold mb-2">Error Loading Template</h3>
        <p className="text-red-600 text-sm">{error}</p>
        <p className="text-red-500 text-xs mt-2">
          Template: {category}/{template}
        </p>
      </div>
    );
  }

  return <div ref={containerRef} className={className} />;
}
