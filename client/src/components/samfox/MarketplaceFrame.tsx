import { useEffect, useRef } from 'react';
import { TemplateLoader } from './TemplateLoader';

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  category?: string;
}

interface MarketplaceFrameProps {
  template: string;
  products?: Product[];
  onProductClick?: (product: Product) => void;
  className?: string;
}

/**
 * MarketplaceFrame - Renderer for marketplace templates
 * 
 * Loads marketplace templates from public/samfox-templates/marketplace/
 * and injects product data dynamically.
 * 
 * @param template - Marketplace template filename
 * @param products - Array of products to display
 * @param onProductClick - Callback when product is clicked
 * @param className - Optional CSS class for container
 */
export function MarketplaceFrame({ 
  template, 
  products = [],
  onProductClick,
  className = ''
}: MarketplaceFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Inject product data into template after load
    if (frameRef.current && products.length > 0) {
      const productContainer = frameRef.current.querySelector('[data-products]');
      
      if (productContainer) {
        productContainer.innerHTML = products.map(product => `
          <div 
            class="product-card group cursor-pointer transition-transform hover:scale-105" 
            data-product-id="${product.id}"
          >
            ${product.image ? `
              <div class="product-image-container relative overflow-hidden rounded-lg mb-3">
                <img 
                  src="${product.image}" 
                  alt="${product.name}" 
                  class="w-full h-48 object-cover transition-transform group-hover:scale-110"
                />
                ${product.category ? `
                  <span class="absolute top-2 right-2 bg-primary text-white px-2 py-1 text-xs rounded">
                    ${product.category}
                  </span>
                ` : ''}
              </div>
            ` : ''}
            
            <div class="product-info">
              <h3 class="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                ${product.name}
              </h3>
              
              ${product.description ? `
                <p class="text-sm text-gray-600 mb-3 line-clamp-2">
                  ${product.description}
                </p>
              ` : ''}
              
              <div class="flex items-center justify-between">
                <span class="text-2xl font-bold text-primary">
                  $${product.price.toFixed(2)}
                </span>
                <button class="btn-primary px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        `).join('');

        // Add click handlers to product cards
        productContainer.querySelectorAll('.product-card').forEach((card, index) => {
          card.addEventListener('click', () => {
            onProductClick?.(products[index]);
          });
        });
      } else {
        // If no data-products container, try to find product grid
        const productGrid = frameRef.current.querySelector('.product-grid, .products-container');
        
        if (productGrid) {
          // Clear existing content
          productGrid.innerHTML = '';
          
          // Create product cards
          products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card p-4 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer';
            card.onclick = () => onProductClick?.(product);
            
            card.innerHTML = `
              ${product.image ? `<img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover rounded mb-3" />` : ''}
              <h3 class="text-lg font-semibold mb-2">${product.name}</h3>
              ${product.description ? `<p class="text-sm text-gray-600 mb-3">${product.description}</p>` : ''}
              <p class="text-xl font-bold text-primary">$${product.price.toFixed(2)}</p>
            `;
            
            productGrid.appendChild(card);
          });
        }
      }
    }
  }, [products, onProductClick]);

  const handleTemplateLoad = (html: string) => {
    // Template loaded successfully
    console.log('Marketplace template loaded');
  };

  const handleTemplateError = (error: Error) => {
    console.error('Failed to load marketplace template:', error);
  };

  return (
    <div ref={frameRef} className={className}>
      <TemplateLoader
        category="marketplace"
        template={template}
        onLoad={handleTemplateLoad}
        onError={handleTemplateError}
      />
      
      {/* Fallback product display if template doesn't have product containers */}
      {products.length > 0 && (
        <div className="marketplace-products-fallback mt-6 hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <div
                key={product.id}
                className="product-card border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onProductClick?.(product)}
              >
                {product.image && (
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover rounded mb-3"
                  />
                )}
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                {product.description && (
                  <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.category && (
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {product.category}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
