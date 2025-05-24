document.addEventListener('DOMContentLoaded', () => {
  // Smooth reveal on scroll
  const revealElements = document.querySelectorAll('.reveal');

  const revealOnScroll = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(revealOnScroll, {
    threshold: 0.1
  });

  revealElements.forEach(el => observer.observe(el));

  // Active nav link switching
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section');

  const setActiveLink = () => {
    let index = sections.length;

    while(--index && window.scrollY + 50 < sections[index].offsetTop) {}

    navLinks.forEach((link) => link.classList.remove('active'));
    navLinks[index].classList.add('active');
  };

  setActiveLink();
  window.addEventListener('scroll', setActiveLink);
});
