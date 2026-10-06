const websiteMessages = JSON.parse(document.querySelector('#site-messages').textContent);
for (const languageLink of document.querySelectorAll('[data-language]')) {
  const updateAnchor = () => { languageLink.hash = location.hash; };
  updateAnchor();
  languageLink.addEventListener('click', updateAnchor);
}
