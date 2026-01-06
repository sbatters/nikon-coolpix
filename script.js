// Loading state management
const loadingOverlay = document.querySelector('.loading-overlay');
const loadingText = document.getElementById('loading-text');
let loadedImagesCount = 0;
const totalImages = document.querySelectorAll('.image-placeholder').length;

// Dropdown toggle
const dropdown = document.querySelector('.dropdown');
const dropdownBtn = document.querySelector('.dropdown-btn');
const dropdownContent = document.querySelector('.dropdown-content');
const filterLinks = document.querySelectorAll('.dropdown-content a');
const imagePlaceholders = document.querySelectorAll('.image-placeholder');

// Toggle dropdown on button click
dropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = dropdown.classList.toggle('active');
    // Update ARIA state
    dropdownBtn.setAttribute('aria-expanded', isExpanded);
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
        dropdownBtn.setAttribute('aria-expanded', 'false');
    }
});

// Keyboard navigation for dropdown
dropdownBtn.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!dropdown.classList.contains('active')) {
            dropdown.classList.add('active');
            dropdownBtn.setAttribute('aria-expanded', 'true');
        }
        // Focus first menu item
        const firstItem = dropdown.querySelector('.dropdown-content a');
        if (firstItem) firstItem.focus();
    }
});

// Keyboard navigation within dropdown menu
filterLinks.forEach((link, index) => {
    link.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIndex = (index + 1) % filterLinks.length;
            filterLinks[nextIndex].focus();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevIndex = (index - 1 + filterLinks.length) % filterLinks.length;
            filterLinks[prevIndex].focus();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            dropdown.classList.remove('active');
            dropdownBtn.setAttribute('aria-expanded', 'false');
            dropdownBtn.focus();
        } else if (e.key === 'Tab') {
            dropdown.classList.remove('active');
            dropdownBtn.setAttribute('aria-expanded', 'false');
        }
    });
});

// Filter functionality
filterLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const filter = e.target.getAttribute('data-filter');
        
        // Update button text
        dropdownBtn.innerHTML = `${e.target.textContent} <span class="arrow" aria-hidden="true">‹</span>`;
        
        // Filter images
        imagePlaceholders.forEach(img => {
            const category = img.getAttribute('data-category');
            
            if (filter === 'all') {
                img.classList.remove('hidden');
                img.removeAttribute('aria-hidden');
            } else if (category === filter) {
                img.classList.remove('hidden');
                img.removeAttribute('aria-hidden');
            } else {
                img.classList.add('hidden');
                img.setAttribute('aria-hidden', 'true');
            }
        });
        
        // Close dropdown
        dropdown.classList.remove('active');
        dropdownBtn.setAttribute('aria-expanded', 'false');
        
        // Announce filter change to screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        const visibleCount = Array.from(imagePlaceholders).filter(img => !img.classList.contains('hidden')).length;
        announcement.textContent = `Filtered to ${filter === 'all' ? 'all categories' : filter}. Showing ${visibleCount} images.`;
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
        
        // If in enlarged view, update to show first image of filtered category
        const enlargedView = document.querySelector('.enlarged-view');
        if (enlargedView) {
            const visibleImages = Array.from(imagePlaceholders).filter(img => !img.classList.contains('hidden'));
            if (visibleImages.length > 0) {
                showEnlargedImage(0, visibleImages);
            } else {
                // No images in this category, go back to gallery
                enlargedView.remove();
                gallery.style.display = 'grid';
            }
        }
    });
});

// Image click to enlarge (shows in page with back button)
const gallery = document.querySelector('.gallery');
const main = document.querySelector('main');

// Load thumbnail images into placeholders
imagePlaceholders.forEach((img) => {
    const imageName = img.getAttribute('data-image');
    const category = img.getAttribute('data-category');
    if (imageName && category) {
        // Add accessibility attributes
        img.setAttribute('role', 'button');
        img.setAttribute('tabindex', '0');
        img.setAttribute('aria-label', `View ${category.replace('-', ' ')} photo ${imageName}`);
        
        // Load image to get natural dimensions
        const tempImg = new Image();
        tempImg.onload = function() {
            img.style.backgroundImage = `url('images/${category}/${imageName}')`;
            img.style.backgroundSize = 'cover';
            img.style.backgroundPosition = 'center';
            // Set height based on image aspect ratio
            const aspectRatio = this.height / this.width;
            img.style.paddingBottom = `${aspectRatio * 100}%`;
            
            // Update loading progress
            loadedImagesCount++;
            const loadingPercentage = (loadedImagesCount / totalImages) * 100;
            
            // Update text when 80-90% loaded
            if (loadingPercentage >= 80 && loadingPercentage < 100 && loadingText.textContent !== 'Almost done...') {
                loadingText.textContent = 'Almost done...';
            }
            
            if (loadedImagesCount === totalImages) {
                // All images loaded, hide spinner
                setTimeout(() => {
                    loadingOverlay.classList.add('hidden');
                }, 300);
            }
        };
        tempImg.src = `images/${category}/${imageName}`;
    }
    
    img.addEventListener('click', () => {
        // Get visible images at click time
        const visibleImages = Array.from(imagePlaceholders).filter(img => !img.classList.contains('hidden'));
        const currentIndex = visibleImages.indexOf(img);
        showEnlargedImage(currentIndex, visibleImages);
    });
    
    // Add keyboard support (Enter and Space keys)
    img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const visibleImages = Array.from(imagePlaceholders).filter(img => !img.classList.contains('hidden'));
            const currentIndex = visibleImages.indexOf(img);
            showEnlargedImage(currentIndex, visibleImages);
        }
    });
    
    // Add pointer cursor to indicate clickability
    img.style.cursor = 'pointer';
});

function showEnlargedImage(currentIndex, visibleImages) {
    const currentImg = visibleImages[currentIndex];
    
    if (!currentImg) return;
    
    const category = currentImg.getAttribute('data-category');
    const imageName = currentImg.getAttribute('data-image');
    const imageUrl = `images/${category}/${imageName}`;
    
    // Hide gallery
    gallery.style.display = 'none';
    
    // Check if view exists for transition
    const existingView = document.querySelector('.enlarged-view');
    const existingImage = existingView ? existingView.querySelector('.enlarged-image') : null;
    
    if (existingView && existingImage) {
        // Fade out existing image
        existingImage.style.opacity = '0';
        
        setTimeout(() => {
            // Update image source
            existingImage.src = imageUrl;
            existingImage.alt = `${category.replace('-', ' ')} photo - ${imageName}`;
            
            // Update button states
            const prevButton = existingView.querySelector('.prev-button');
            const nextButton = existingView.querySelector('.next-button');
            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex === visibleImages.length - 1;
            prevButton.setAttribute('aria-label', 'Previous image');
            nextButton.setAttribute('aria-label', 'Next image');
            
            // Remove old event listeners by cloning and replacing buttons
            const newPrevButton = prevButton.cloneNode(true);
            const newNextButton = nextButton.cloneNode(true);
            prevButton.replaceWith(newPrevButton);
            nextButton.replaceWith(newNextButton);
            
            // Re-attach event listeners
            newPrevButton.addEventListener('click', () => {
                if (currentIndex > 0) {
                    showEnlargedImage(currentIndex - 1, visibleImages);
                }
            });
            
            newNextButton.addEventListener('click', () => {
                if (currentIndex < visibleImages.length - 1) {
                    showEnlargedImage(currentIndex + 1, visibleImages);
                }
            });
            
            // Fade in new image
            existingImage.style.opacity = '1';
        }, 200);
    } else {
        // Create new enlarged view
        const enlargedView = document.createElement('div');
        enlargedView.className = 'enlarged-view';
        enlargedView.setAttribute('role', 'dialog');
        enlargedView.setAttribute('aria-label', 'Enlarged photo view');
        enlargedView.innerHTML = `
            <button class="back-button" aria-label="Close enlarged view and return to gallery">← Back to gallery</button>
            <div class="enlarged-image-wrapper">
                <button class="nav-button prev-button" ${currentIndex === 0 ? 'disabled' : ''} aria-label="Previous image">‹</button>
                <div class="enlarged-image-container">
                    <img src="${imageUrl}" alt="${category.replace('-', ' ')} photo - ${imageName}" class="enlarged-image">
                </div>
                <button class="nav-button next-button" ${currentIndex === visibleImages.length - 1 ? 'disabled' : ''} aria-label="Next image">›</button>
            </div>
        `;
        
        main.appendChild(enlargedView);
        
        // Focus management - move focus to dialog
        const firstButton = enlargedView.querySelector('.back-button');
        firstButton.focus();
        
        // Back button functionality
        const backButton = enlargedView.querySelector('.back-button');
        backButton.addEventListener('click', () => {
            enlargedView.remove();
            gallery.style.display = 'grid';
            // Return focus to the image that was clicked
            currentImg.focus();
        });
        
        // Add keyboard support for Escape key to close dialog
        enlargedView.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                enlargedView.remove();
                gallery.style.display = 'grid';
                currentImg.focus();
            }
        });
        
        // Previous button functionality
        const prevButton = enlargedView.querySelector('.prev-button');
        prevButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                showEnlargedImage(currentIndex - 1, visibleImages);
            }
        });
        
        // Add keyboard support for arrow keys
        prevButton.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' && currentIndex > 0) {
                showEnlargedImage(currentIndex - 1, visibleImages);
            }
        });
        
        // Next button functionality
        const nextButton = enlargedView.querySelector('.next-button');
        nextButton.addEventListener('click', () => {
            if (currentIndex < visibleImages.length - 1) {
                showEnlargedImage(currentIndex + 1, visibleImages);
            }
        });
        
        // Add keyboard support for arrow keys
        nextButton.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' && currentIndex < visibleImages.length - 1) {
                showEnlargedImage(currentIndex + 1, visibleImages);
            }
        });
    }
}
