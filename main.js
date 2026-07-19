document.addEventListener('DOMContentLoaded', () => {
  fetch('projects.json')
    .then(res => res.json())
    .then(data => {
      initPortfolio(data);
    })
    .catch(err => {
      console.error('Error fetching projects.json:', err);
      document.getElementById('projects-container').innerHTML = '<p>Error loading projects. Ensure projects.json is generated.</p>';
    });
});

function initPortfolio(projects) {
  // Extract categories and counts
  const categoryCounts = { 'All': projects.length };
  projects.forEach(p => {
    const cat = p.category;
    if (cat) {
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    }
  });

  // Render filters
  const filterContainer = document.getElementById('filter-container');
  filterContainer.innerHTML = ''; // Clear default
  
  Object.keys(categoryCounts).forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `pill ${cat === 'All' ? 'active' : ''}`;
    btn.dataset.filter = cat;
    btn.innerHTML = `${cat} <span class="count">${String(categoryCounts[cat]).padStart(2, '0')}</span>`;
    
    btn.addEventListener('click', () => {
      // Update active state
      document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      
      // Filter projects
      renderProjects(projects, cat);
    });
    
    filterContainer.appendChild(btn);
  });

  // Initial render
  renderProjects(projects, 'All');
}

function renderProjects(projects, filterCategory) {
  const container = document.getElementById('projects-container');
  container.innerHTML = '';
  
  const filtered = filterCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === filterCategory);
    
  if (filtered.length === 0) {
    container.innerHTML = '<p>No projects found for this category.</p>';
    return;
  }
  
  filtered.forEach(p => {
    const article = document.createElement('article');
    article.className = 'project-card';
    
    // Formatting index as 01, 02...
    const idxStr = String(p.index).padStart(2, '0');
    
    // Formatting meta line
    const metaParts = [p.org, p.type, p.tech, p.date].filter(Boolean);
    const metaLine = metaParts.join(' &middot; ');
    
    // Formatting highlights
    const highlightsHtml = (p.highlights || []).map(h => `<li>${h}</li>`).join('');
    
    // Formatting topics
    const topicsHtml = (p.topics || []).join(', ');
    
    // Formatting links
    let linksHtml = '';
    if (p.links) {
      if (p.links.repo) linksHtml += `<a href="${p.links.repo}" target="_blank">► GitHub Repository</a>`;
      if (p.links.demo) linksHtml += `<a href="${p.links.demo}" target="_blank">► Live Demo</a>`;
    }
    
    article.innerHTML = `
      <div class="project-number">${idxStr}</div>
      <div class="project-content">
        ${p.category ? `<div class="project-category">${p.category}</div>` : ''}
        <h2 class="project-title">${p.title}</h2>
        <div class="project-meta">${metaLine}</div>
        <p class="project-summary">${p.summary}</p>
        ${highlightsHtml ? `<ul class="project-highlights">${highlightsHtml}</ul>` : ''}
        ${topicsHtml ? `<div class="project-topics"><span class="label">TOPICS</span> ${topicsHtml}</div>` : ''}
        ${linksHtml ? `<div class="project-links">${linksHtml}</div>` : ''}
      </div>
    `;
    
    container.appendChild(article);
  });
}
