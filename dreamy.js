// DreamyImage - Unsplash-powered version (no API key required)

const form = document.getElementById('promptForm');
const input = document.getElementById('promptInput');
const generateBtn = document.getElementById('generateBtn');
const statusEl = document.getElementById('status');
const grid = document.getElementById('grid');
const multipleCheckbox = document.getElementById('multiple');

// helper: create element from template
function createImageCard(imgUrl, query){
  const tpl = document.getElementById('imgTemplate');
  const clone = tpl.content.cloneNode(true);
  const img = clone.querySelector('img');
  const downloadBtn = clone.querySelector('.download');
  const viewBtn = clone.querySelector('.view');
  const sourceLink = clone.querySelector('.source');

  img.src = imgUrl;
  img.alt = query;

  // view
  viewBtn.addEventListener('click', () => window.open(imgUrl, '_blank'));

  // download
  downloadBtn.addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = imgUrl;
    a.download = 'dreamyimage.jpg';
    document.body.appendChild(a);
    a.click();
    a.remove();
  });

  // Unsplash link
  sourceLink.href = `https://unsplash.com/s/photos/${encodeURIComponent(query)}`;
  sourceLink.textContent = 'Unsplash';

  return clone;
}

function setStatus(text, loading=false){
  statusEl.innerHTML = loading ? `<span class="spinner"></span> ${text}` : text;
}

async function generate(e){
  e.preventDefault();
  grid.innerHTML = '';
  const prompt = input.value.trim();
  if(!prompt) return;

  setStatus('Fetching beautiful images from Unsplash…', true);
  generateBtn.disabled = true;

  try{
    const showMultiple = multipleCheckbox.checked;
    const count = showMultiple ? 6 : 1;
    const query = encodeURIComponent(prompt);

    for(let i=0; i<count; i++){
      // Use Unsplash random endpoint with query
      const imgUrl = `https://source.unsplash.com/featured/?${query}&sig=${Math.random()}`;
      const card = createImageCard(imgUrl, prompt);
      grid.appendChild(card);
    }

    setStatus(`Showing ${count} image${count>1?'s':''} for "${prompt}"`);
  } catch(err){
    console.error(err);
    setStatus('Something went wrong fetching images.');
  } finally {
    generateBtn.disabled = false;
  }
}

form.addEventListener('submit', generate);
