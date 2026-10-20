(() => {
  const section = document.querySelector('#project-videos');
  const choices = document.querySelector('#video-choices');
  const status = document.querySelector('#video-status');
  const en = document.documentElement.lang === 'en';
  let generation = 0;
  function stopVideos() {
    generation++;
    choices.querySelectorAll('video').forEach(video => {
      video.pause(); video.removeAttribute('src'); video.load();
    });
  }
  window.prepareProjectVideos = project => {
    stopVideos(); choices.replaceChildren(); status.textContent = '';
    section.hidden = !project.videos?.length;
    const current = generation;
    (project.videos || []).forEach((path, index) => {
      const card = document.createElement('article'); card.className = 'project-video-card';
      const frame = document.createElement('div'); frame.className = 'video-preview';
      const video = document.createElement('video');
      video.preload = 'none'; video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.poster = 'assets/' + (project.videoPosters?.[index] || project.thumbnail || project.images[0]);
      video.setAttribute('aria-label', project.title + ' — Video ' + (index + 1));
      const play = document.createElement('button'); play.type = 'button'; play.className = 'video-play-overlay';
      play.setAttribute('aria-label', (en ? 'Play video ' : 'Luaj videon ') + (index + 1) + ': ' + project.title);
      const icon = document.createElement('span'); icon.className = 'video-play-circle'; icon.textContent = '▶'; icon.setAttribute('aria-hidden', 'true');
      const label = document.createElement('span'); label.className = 'video-play-label'; label.textContent = (en ? 'Play video' : 'Luaj videon');
      play.append(icon, label);
      const caption = document.createElement('div'); caption.className = 'video-card-caption';
      const title = document.createElement('span'); title.textContent = 'Video ' + (index + 1);
      const link = document.createElement('a'); link.href = 'assets/' + path; link.target = '_blank'; link.rel = 'noopener'; link.textContent = en ? 'Open separately ↗' : 'Hap veçmas ↗';
      caption.append(title, link);
      play.addEventListener('click', () => {
        choices.querySelectorAll('video').forEach(other => { if (other !== video) other.pause(); });
        if (!video.getAttribute('src')) video.src = 'assets/' + path;
        video.controls = true; play.hidden = true; status.textContent = '';
        const attempt = video.play();
        if (attempt) attempt.catch(() => {
          if (generation !== current) return;
          play.hidden = false;
          status.textContent = en ? 'Tap play to start, or open the video separately.' : 'Prekni luaj për ta nisur, ose hapeni videon veçmas.';
        });
      });
      video.addEventListener('play', () => {
        choices.querySelectorAll('video').forEach(other => { if (other !== video) other.pause(); });
      });
      video.addEventListener('ended', () => { video.controls = false; play.hidden = false; });
      video.addEventListener('error', () => {
        if (generation !== current || !video.getAttribute('src')) return;
        play.hidden = false;
        status.textContent = en ? 'Unable to play. Try opening the video separately.' : 'Videoja nuk po luhet. Provoni ta hapni veçmas.';
      });
      frame.append(video, play); card.append(frame, caption); choices.append(card);
    });
  };
  document.querySelector('#project-dialog').addEventListener('close', stopVideos);
})();
