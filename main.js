
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
        card.addEventListener('click', () => {
            const issueId = issue.id || issue._id; 
            fetchSingleIssue(issueId);
        });
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


const fetchSingleIssue = async (id) => {
    try {
        const response = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
        const data = await response.json();
        
        const issueDetails = data.data || data;

        
        const currentStatus = issueDetails.status ? issueDetails.status.toLowerCase() : '';
        const borderClass = currentStatus === 'open' ? 'border-green-400' : 'border-purple-400';
        const statusBadgeClass = currentStatus === 'open' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700';
        
        const currentPriority = issueDetails.priority ? issueDetails.priority.toLowerCase() : '';
        const priorityBadgeClass = currentPriority === 'high' ? 'bg-red-100 text-red-500' : 
                                   (currentPriority === 'medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-500');

        
        const modalBox = document.querySelector('#issue-modal .modal-box');
        
        modalBox.innerHTML = `
            <div class="border-2 border-dashed ${borderClass} rounded-lg p-6 relative bg-white">
                
                <h3 class="font-bold text-xl text-gray-800 mb-3 pr-10">${issueDetails.title || 'No Title'}</h3>
                
                <div class="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-4 font-medium">
                    <span class="px-2 py-1 rounded font-bold ${statusBadgeClass} capitalize">${issueDetails.status || 'Unknown'}</span>
                    <span>•</span>
                    <span>Opened by ${issueDetails.author || 'Unknown'}</span>
                    <span>•</span>
                    <span>${issueDetails.CreatedAt || issueDetails.createdAt || 'N/A'}</span>
                </div>

                <div class="flex gap-2 mb-5 text-xs font-bold uppercase tracking-wider">
                    <span class="px-2 py-1 rounded bg-red-100 text-red-500"><i class="fa-solid fa-bug mr-1"></i> ${issueDetails.label || 'Bug'}</span>
                </div>

                <p class="text-sm text-gray-600 mb-8 leading-relaxed">${issueDetails.description || 'No description available for this issue.'}</p>

                <div class="flex justify-between items-center text-sm mb-4">
                    <div>
                        <p class="text-gray-400 mb-1 font-medium">Assignee:</p>
                        <p class="font-bold text-gray-800">${issueDetails.author || 'Unassigned'}</p>
                    </div>
                    <div>
                        <p class="text-gray-400 mb-1 font-medium text-right">Priority:</p>
                        <span class="px-3 py-1 rounded font-bold text-xs ${priorityBadgeClass} uppercase inline-block">${issueDetails.priority || 'Normal'}</span>
                    </div>
                </div>

                <div class="modal-action mt-6 flex justify-end">
                    <form method="dialog">
                        <button class="btn bg-indigo-600 hover:bg-indigo-700 text-white border-none px-6">Close</button>
                    </form>
                </div>
            </div>
        `;

        
        document.getElementById('issue-modal').showModal();

    } catch (error) {
        console.error(error);
    }
};

fetchAllIssues();