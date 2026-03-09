
let allFetchedIssues = []; 

const searchInput = document.getElementById ('search-input');
const searchBtn = document.getElementById('search-btn');
const issuesContainer = document.getElementById('issues-container');
const loadingSpinner = document.getElementById('loading-spinner');
const totalIssuesCount = document.getElementById('total-issues-count');
const openCount = document.getElementById('open-count');
const closedCount = document.getElementById('closed-count');


const fetchAllIssues = async () => {
    loadingSpinner.classList.remove('hidden');
    issuesContainer.innerHTML = ''; 

    try {
        const response = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
        const data = await response.json();
        
        
        let issuesArray = [];
        if (Array.isArray(data)) {
            issuesArray = data;
        } else if (data.data && Array.isArray(data.data)) {
            issuesArray = data.data; 
        } else if (data.issues && Array.isArray(data.issues)) {
            issuesArray = data.issues;
        } else {
            console.error( data);
            return;
        }
        
        
        allFetchedIssues = issuesArray; 
        
        
        displayIssues(allFetchedIssues); 

    } catch (error) {
        console.error( error);
    } finally {
        loadingSpinner.classList.add('hidden');
    }
};


const displayIssues = (issues) => {
    issuesContainer.innerHTML = ''; 
    totalIssuesCount.innerText = issues.length;
    
    let openIssues = 0;
    let closedIssues = 0;

    issues.forEach(issue => {
        const currentStatus = issue.status ? issue.status.toLowerCase() : '';
        if (currentStatus === 'open') {
            openIssues++;
        } else {
            closedIssues++;
        }

        const topBorderColor = currentStatus === 'open' ? 'border-t-green-500' : 'border-t-purple-500';
        const statusBgColor = currentStatus === 'open' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700';

        const card = document.createElement('div');
        card.className = `bg-white p-5 rounded-lg shadow-sm border border-gray-200 border-t-4 ${topBorderColor} cursor-pointer hover:shadow-md transition flex flex-col h-full`;
        
        card.innerHTML = `
            <div class="flex justify-between items-start mb-3">
                <span class="text-xs font-semibold px-2 py-1 rounded bg-gray-100 text-gray-600">${issue.priority || 'Normal'}</span>
                <span class="text-xs font-semibold px-2 py-1 rounded ${statusBgColor} capitalize">${issue.status || 'Unknown'}</span>
            </div>
            <h3 class="font-bold text-gray-800 text-lg mb-2 truncate">${issue.title || 'No Title'}</h3>
            <p class="text-sm text-gray-500 mb-4 line-clamp-2">${issue.description || 'No description available.'}</p>
            <div class="text-xs text-gray-500 mt-auto space-y-1 border-t pt-3">
                <p><i class="fa-solid fa-user mr-1"></i> <strong>Author:</strong> ${issue.author || 'N/A'}</p>
                <p><i class="fa-solid fa-tag mr-1"></i> <strong>Label:</strong> ${issue.label || 'N/A'}</p>
                <p><i class="fa-solid fa-calendar mr-1"></i> <strong>Created:</strong> ${issue.CreatedAt || issue.createdAt || 'N/A'}</p>
            </div>
        `;
        
        issuesContainer.appendChild(card);
    });

    openCount.innerText = openIssues;
    closedCount.innerText = closedIssues;
};


const tabButtons = document.querySelectorAll('.tab-btn'); 

tabButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        
        tabButtons.forEach(btn => {
            btn.classList.remove('bg-indigo-600', 'text-white', 'shadow');
            btn.classList.add('text-gray-600', 'hover:bg-gray-300');
        });

        const clickedButton = event.target;
        clickedButton.classList.remove('text-gray-600', 'hover:bg-gray-300');
        clickedButton.classList.add('bg-indigo-600', 'text-white', 'shadow');

        const category = clickedButton.getAttribute('data-category');

        if (category === 'all') {
            displayIssues(allFetchedIssues); 
        } else {
            const filteredIssues = allFetchedIssues.filter(issue => {
                const currentStatus = issue.status ? issue.status.toLowerCase() : '';
                return currentStatus === category;
            });
            displayIssues(filteredIssues); 
        }
    });
});


searchBtn.addEventListener('click', async () => {
    
    const searchText = searchInput.value.trim();

    
    if (searchText === '') {
        alert("Please enter something to search!");
        return;
    }

    
    loadingSpinner.classList.remove('hidden');
    issuesContainer.innerHTML = '';

    try {
        
        const response = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`);
        const data = await response.json();
        
        
        let searchResults = [];
        if (Array.isArray(data)) {
            searchResults = data;
        } else if (data.data && Array.isArray(data.data)) {
            searchResults = data.data; 
        } else if (data.issues && Array.isArray(data.issues)) {
            searchResults = data.issues;
        }
        
        
        allFetchedIssues = searchResults; 
        
        
        displayIssues(allFetchedIssues);

        
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('bg-indigo-600', 'text-white', 'shadow');
            btn.classList.add('text-gray-600', 'hover:bg-gray-300');
            if(btn.getAttribute('data-category') === 'all') {
                btn.classList.remove('text-gray-600', 'hover:bg-gray-300');
                btn.classList.add('bg-indigo-600', 'text-white', 'shadow');
            }
        });

    } catch (error) {
        console.error( error);
    } finally {
        loadingSpinner.classList.add('hidden');
    }
});
fetchAllIssues();