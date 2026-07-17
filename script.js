document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const addBtn = document.getElementById('add-btn');
    const filterBtn = document.getElementById('filter-btn');
    const clearFilterBtn = document.getElementById('clear-filter');
    const bookmarksContainer = document.getElementById('bookmarks-container');
    
    // Initialize bookmarks array
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    
    // Display all bookmarks on page load
    displayBookmarks(bookmarks);
    
    // Add Bookmark Event
    addBtn.addEventListener('click', addBookmark);
    
    // Filter Bookmark Event
    filterBtn.addEventListener('click', filterBookmarks);
    
    // Clear Filter Event
    clearFilterBtn.addEventListener('click', function() {
        document.getElementById('filter-tags').value = '';
        displayBookmarks(bookmarks);
    });
    
    // Function to add a new bookmark
    function addBookmark() {
        const title = document.getElementById('title').value.trim();
        const url = document.getElementById('url').value.trim();
        const tags = document.getElementById('tags').value.trim();
        
        if (!title || !url) {
            alert('Please fill in both title and URL fields');
            return;
        }
        
        // Create bookmark object
        const bookmark = {
            id: Date.now(),
            title,
            url: url.includes('://') ? url : `https://${url}`,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : []
        };
        
        // Add to bookmarks array
        bookmarks.push(bookmark);
        
        // Save to localStorage
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        
        // Display all bookmarks
        displayBookmarks(bookmarks);
        
        // Clear form
        document.getElementById('title').value = '';
        document.getElementById('url').value = '';
        document.getElementById('tags').value = '';
    }
    
    // Function to filter bookmarks by tag
    function filterBookmarks() {
        const filterTag = document.getElementById('filter-tags').value.trim().toLowerCase();
        
        if (!filterTag) {
            displayBookmarks(bookmarks);
            return;
        }
        
        const filteredBookmarks = bookmarks.filter(bookmark => 
            bookmark.tags.some(tag => tag.toLowerCase().includes(filterTag))
        );
        
        displayBookmarks(filteredBookmarks);
    }
    
    // Function to display bookmarks
    function displayBookmarks(bookmarksToDisplay) {
        bookmarksContainer.innerHTML = '';
        
        if (bookmarksToDisplay.length === 0) {
            bookmarksContainer.innerHTML = '<p>No bookmarks found.</p>';
            return;
        }
        
        bookmarksToDisplay.forEach(bookmark => {
            const bookmarkEl = document.createElement('div');
            bookmarkEl.className = 'bookmark-item';
            bookmarkEl.innerHTML = `
                <h3>${bookmark.title}</h3>
                <a href="${bookmark.url}" target="_blank">${bookmark.url}</a>
                <div class="bookmark-tags">
                    ${bookmark.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <button class="delete-btn" data-id="${bookmark.id}">Delete</button>
            `;
            bookmarksContainer.appendChild(bookmarkEl);
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', deleteBookmark);
        });
    }
    
    // Function to delete a bookmark
    function deleteBookmark(e) {
        const id = parseInt(e.target.getAttribute('data-id'));
        
        // Filter out the bookmark with the given id
        bookmarks = bookmarks.filter(bookmark => bookmark.id !== id);
        
        // Update localStorage
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        
        // Refresh display
        displayBookmarks(bookmarks);
    }
});