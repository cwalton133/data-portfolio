
function loadMore(id){
let items=document.querySelectorAll('#'+id+' .hidden');
for(let i=0;i<3 && i<items.length;i++){items[i].classList.remove('hidden');}
}
function submitForm(e){
e.preventDefault();
document.getElementById("msg").innerHTML="Message sent successfully!";
}
// async function fetchGitHubRepos() {
//     const username = "yourusername"; // 🔁 replace this
//     const container = document.getElementById("githubProjects");

//     try {
//         const response = await fetch(`https://api.github.com/users/${username}/repos`);
//         let repos = await response.json();

//         // Sort by most recently updated
//         repos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

//         container.innerHTML = "";

//         let count = 0;

//         for (let repo of repos) {

//             // ✅ FILTER: only show relevant data projects
//             if (!repo.description || 
//                 (!repo.description.toLowerCase().includes("data") &&
//                  !repo.description.toLowerCase().includes("sql") &&
//                  !repo.description.toLowerCase().includes("dashboard") &&
//                  !repo.description.toLowerCase().includes("etl") &&
//                  !repo.description.toLowerCase().includes("analysis"))) {
//                 continue; // skip this repo
//             }

//             // Limit to 6 displayed projects
//             if (count >= 6) break;

//             const card = `
//             <div class="col-md-4 mb-4">
//                 <div class="card p-4 h-100">

//                     <h5>${repo.name}</h5>

//                     <p>${repo.description || "No description provided."}</p>

//                     <div class="mb-2">
//                         <span class="badge bg-primary">${repo.language || "Code"}</span>
//                         <span class="badge bg-secondary">⭐ ${repo.stargazers_count}</span>
//                     </div>

//                     <a href="${repo.html_url}" target="_blank" 
//                        class="btn btn-outline-light mt-auto">
//                         View Repository
//                     </a>

//                 </div>
//             </div>
//             `;

//             container.innerHTML += card;
//             count++;
//         }

//         // If nothing matched filter
//         if (count === 0) {
//             container.innerHTML = "<p class='text-warning'>No relevant data projects found. Update your repo descriptions.</p>";
//         }

//     } catch (error) {
//         container.innerHTML = "<p class='text-danger'>Failed to load GitHub projects.</p>";
//         console.error(error);
//     }
// }

// // Run on page load
// document.addEventListener("DOMContentLoaded", fetchGitHubRepos);



async function fetchEliteProjects() {
    const username = "cwalton133";
    const container = document.getElementById("githubProjects");
    const featured = document.getElementById("featuredProject");

    try {
        const res = await fetch(`https://api.github.com/users/${username}/repos`);
        let repos = await res.json();

        // Filter relevant projects
        repos = repos.filter(repo =>
            repo.description &&
            /data|sql|etl|dashboard|analysis|bi/i.test(repo.description)
        );

        // Rank projects
        repos.sort((a, b) => {
            const scoreA = a.stargazers_count * 2 + new Date(a.updated_at).getTime();
            const scoreB = b.stargazers_count * 2 + new Date(b.updated_at).getTime();
            return scoreB - scoreA;
        });

        container.innerHTML = "";
        let count = 0;

        for (let repo of repos) {

            // ===== FETCH README =====
            let readmeText = "No README available.";
            let imageUrl = "https://via.placeholder.com/600x300?text=Project+Preview";

            try {
                const readmeRes = await fetch(`https://api.github.com/repos/${username}/${repo.name}/readme`);
                const readmeData = await readmeRes.json();

                if (readmeData.content) {
                    const decoded = atob(readmeData.content.replace(/\n/g, ""));

                    const imgMatch = decoded.match(/!\[.*?\]\((.*?)\)/);
                    if (imgMatch) imageUrl = imgMatch[1];

                    readmeText = decoded.replace(/[#>*`]/g, "").substring(0, 180) + "...";
                }
            } catch {}

            // ===== 🔥 TAGS (THIS IS WHERE YOUR CODE GOES) =====
            const tags = [];

            if (repo.language) tags.push(repo.language);
            if (/python/i.test(repo.name)) tags.push("Python");
            if (/sql/i.test(repo.name)) tags.push("SQL");
            if (/etl/i.test(repo.name)) tags.push("ETL");

            const badges = tags.map(t => 
                `<span class="badge bg-primary me-1">${t}</span>`
            ).join(" ");

            // ===== FEATURED PROJECT =====
            if (count === 0 && featured) {
                featured.innerHTML = `
                <div class="card p-4 mb-5">

                    <img src="${imageUrl}" class="img-fluid rounded mb-4">

                    <h2>${repo.name}</h2>

                    <p>${readmeText}</p>

                    <div class="mb-3">${badges}</div>

                    <a href="${repo.html_url}" target="_blank"
                       class="btn btn-primary">
                       View Project
                    </a>

                </div>
                `;
            }

            // Limit to 6
            if (count >= 6) break;

            // ===== CARD OUTPUT =====
            const card = `
            <div class="col-md-4 mb-4">
                <div class="card h-100 p-0 overflow-hidden">

                    <img src="${imageUrl}" class="img-fluid" style="height:200px; object-fit:cover;">

                    <div class="p-4 d-flex flex-column h-100">

                        <h5>${repo.name}</h5>

                        <p style="font-size:0.9rem;">${readmeText}</p>

                        <!-- 🔥 TAG BADGES INSERTED HERE -->
                        <div class="mb-2">${badges}</div>

                        <a href="${repo.html_url}" target="_blank"
                           class="btn btn-outline-light mt-auto">
                           View Repo
                        </a>

                    </div>
                </div>
            </div>
            `;

            container.innerHTML += card;
            count++;
        }

        if (count === 0) {
            container.innerHTML = "<p class='text-warning text-center'>No strong projects found.</p>";
        }

    } catch (err) {
        container.innerHTML = "<p class='text-danger text-center'>Failed to load projects.</p>";
    }
}

document.addEventListener("DOMContentLoaded", fetchEliteProjects);
