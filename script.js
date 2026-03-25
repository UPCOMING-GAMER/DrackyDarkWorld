const AUTH_KEY = "dracky_auth";
const PROFILE_KEY = "dracky_profile";
const UPLOADS_KEY = "dracky_uploads";

const DEFAULT_UPLOADS = [
  {
    title: "Moon Whisper",
    category: "Portraits",
    description: "Detailed portrait work with handwritten textures and symbolic line art.",
    image: "images/about.jpg",
    seed: true,
  },
  {
    title: "Silent Mark",
    category: "Sketches",
    description: "Sketchbook-style layouts with raw line energy and dramatic contrast.",
    image: "images/contact.jpg",
    seed: true,
  },
  {
    title: "Crimson Gate",
    category: "Fantasy",
    description: "Dark world concepts for eerie settings, symbols, and dreamlike scenes.",
    image: "images/services.jpg",
    seed: true,
  },
];

function getStoredAuth() {
  return localStorage.getItem(AUTH_KEY) === "true";
}

function setStoredAuth(value) {
  localStorage.setItem(AUTH_KEY, String(value));
}

function getStoredUploads() {
  try {
    const parsed = JSON.parse(localStorage.getItem(UPLOADS_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveUpload(upload) {
  const uploads = getStoredUploads();
  uploads.unshift(upload);
  localStorage.setItem(UPLOADS_KEY, JSON.stringify(uploads));
}

function getAllUploads() {
  return [...getStoredUploads(), ...DEFAULT_UPLOADS];
}

function createGalleryCard(upload) {
  const card = document.createElement("article");
  card.className = "gallery-card";
  card.dataset.category = upload.category;
  card.innerHTML = `
    <img src="${upload.image}" alt="${upload.title}">
    <div class="gallery-copy">
      <span>${upload.category}</span>
      <h3>${upload.title}</h3>
      <p>${upload.description}</p>
    </div>
  `;
  return card;
}

function renderSavedUploads() {
  const artGallery = document.getElementById("artGallery");

  if (!artGallery) {
    return;
  }

  artGallery.innerHTML = "";
  getAllUploads().forEach((upload) => artGallery.appendChild(createGalleryCard(upload)));
}

function getStoredProfile() {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY) || "null");
  } catch {
    return null;
  }
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("File read failed"));
    reader.readAsDataURL(file);
  });
}

function renderProfileSections() {
  const profile = getStoredProfile();
  const uploads = getStoredUploads();
  const isAuthorized = getStoredAuth();

  const profileTargets = [
    {
      name: document.getElementById("profileName"),
      handle: document.getElementById("profileHandle"),
      avatar: document.getElementById("profileAvatar"),
      text: document.getElementById("profileMessage"),
    },
    {
      name: document.getElementById("uploadProfileName"),
      handle: document.getElementById("uploadProfileHandle"),
      avatar: document.getElementById("uploadProfileAvatar"),
      text: document.getElementById("uploadProfileText"),
    },
  ];

  profileTargets.forEach((target) => {
    if (!target.name || !target.handle || !target.avatar || !target.text) {
      return;
    }

    const name = profile?.name || "Dark Creator";
    const username = profile?.username || "dracky_artist";

    target.name.textContent = name;
    target.handle.textContent = `@${username}`;
    target.avatar.textContent = name.charAt(0).toUpperCase();
    target.text.textContent = isAuthorized
      ? "Profile active. You can publish portraits, sketching work, and user arts."
      : "Create an account or log in to unlock professional uploads.";
  });

  const profileAccess = document.getElementById("profileAccess");
  const profileUploadCount = document.getElementById("profileUploadCount");
  const profileUploads = document.getElementById("profileUploads");

  if (profileAccess) {
    profileAccess.textContent = isAuthorized ? "Active" : "Locked";
  }

  if (profileUploadCount) {
    profileUploadCount.textContent = String(uploads.length);
  }

  if (profileUploads) {
    if (!uploads.length) {
      profileUploads.innerHTML = '<p class="empty-note">No uploads yet. Add your portraits, sketches, or fantasy arts from the upload page.</p>';
    } else {
      profileUploads.innerHTML = "";
      uploads.slice(0, 4).forEach((upload) => {
        const item = document.createElement("article");
        item.className = "mini-gallery-item";
        item.innerHTML = `
          <img src="${upload.image}" alt="${upload.title}">
          <div>
            <h3>${upload.title}</h3>
            <p>${upload.category}</p>
          </div>
        `;
        profileUploads.appendChild(item);
      });
    }
  }
}

function initGalleryFilters() {
  const filterBar = document.getElementById("galleryFilters");
  const artGallery = document.getElementById("artGallery");

  if (!filterBar || !artGallery) {
    return;
  }

  filterBar.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");

    if (!button) {
      return;
    }

    const filter = button.dataset.filter;
    filterBar.querySelectorAll(".filter-chip").forEach((chip) => chip.classList.remove("active"));
    button.classList.add("active");

    artGallery.querySelectorAll(".gallery-card").forEach((card) => {
      const matches = filter === "all" || card.dataset.category === filter;
      card.style.display = matches ? "" : "none";
    });
  });
}

function initProfilePage() {
  const logoutButton = document.getElementById("logoutButton");
  const logoutStatus = document.getElementById("logoutStatus");

  if (!logoutButton || !logoutStatus) {
    return;
  }

  logoutButton.addEventListener("click", () => {
    setStoredAuth(false);
    logoutStatus.textContent = "You have been logged out. Upload access is now locked.";
    renderProfileSections();
  });
}

function initUploadPage() {
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");
  const artForm = document.getElementById("artForm");
  const uploadSection = document.getElementById("uploadSection");
  const uploadPageNotice = document.getElementById("uploadPageNotice");

  if (!signupForm || !loginForm || !artForm || !uploadSection) {
    return;
  }

  const signupName = document.getElementById("signupName");
  const signupUsername = document.getElementById("signupUsername");
  const signupStatus = document.getElementById("signupStatus");
  const loginStatus = document.getElementById("loginStatus");
  const artStatus = document.getElementById("artStatus");
  const artTitle = document.getElementById("artTitle");
  const artCategory = document.getElementById("artCategory");
  const artDescription = document.getElementById("artDescription");
  const artFile = document.getElementById("artFile");
  const artPreviewImage = document.getElementById("artPreviewImage");
  const artPreviewTitle = document.getElementById("artPreviewTitle");
  const artPreviewCategory = document.getElementById("artPreviewCategory");
  const artPreviewDescription = document.getElementById("artPreviewDescription");
  let uploadedImageData = artPreviewImage.src;

  function syncAccess() {
    const isAuthorized = getStoredAuth();

    if (isAuthorized) {
      uploadSection.classList.remove("locked");
      uploadPageNotice.textContent = "Account active. You can now upload artwork and publish it to collections.";
    } else {
      uploadSection.classList.add("locked");
      uploadPageNotice.textContent = "Browsing collections is free. Upload access is reserved for signed-in creators.";
    }
  }

  if (artTitle) {
    artTitle.addEventListener("input", () => {
      artPreviewTitle.textContent = artTitle.value.trim() || "Untitled Art";
    });
  }

  if (artCategory) {
    artCategory.addEventListener("change", () => {
      artPreviewCategory.textContent = artCategory.value;
    });
  }

  if (artDescription) {
    artDescription.addEventListener("input", () => {
      artPreviewDescription.textContent =
        artDescription.value.trim() || "Your uploaded art preview will appear here before publish.";
    });
  }

  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    setStoredAuth(true);
    localStorage.setItem(
      PROFILE_KEY,
      JSON.stringify({
        name: signupName.value.trim() || "Dark Creator",
        username: signupUsername.value.trim() || "dracky_artist",
      })
    );
    signupStatus.textContent = "Signup complete. Upload access unlocked.";
    loginStatus.textContent = "";
    syncAccess();
    renderProfileSections();
  });

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    setStoredAuth(true);
    loginStatus.textContent = "Login successful. Upload access unlocked.";
    signupStatus.textContent = "";
    syncAccess();
    renderProfileSections();
  });

  artFile.addEventListener("change", async (event) => {
    const [file] = event.target.files;

    if (!file) {
      return;
    }

    try {
      uploadedImageData = await readFileAsDataUrl(file);
      artPreviewImage.src = uploadedImageData;
    } catch {
      artStatus.textContent = "Image preview failed. Please choose another file.";
    }
  });

  artForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!getStoredAuth()) {
      artStatus.textContent = "Please sign up or log in before uploading.";
      syncAccess();
      return;
    }

    const upload = {
      title: artTitle.value.trim() || "Untitled Art",
      category: artCategory.value,
      description: artDescription.value.trim() || "User-submitted artwork from Dracky Dark World.",
      image: uploadedImageData || artPreviewImage.src,
    };

    saveUpload(upload);
    artStatus.textContent = "Artwork uploaded successfully. View it on the Collections page.";
    artForm.reset();
    artPreviewImage.src = "images/about.jpg";
    uploadedImageData = "images/about.jpg";
    artPreviewTitle.textContent = "Untitled Art";
    artPreviewCategory.textContent = "Portraits";
    artPreviewDescription.textContent = "Your uploaded art preview will appear here before publish.";
    renderProfileSections();
  });

  syncAccess();
  renderProfileSections();
}

renderSavedUploads();
renderProfileSections();
initGalleryFilters();
initProfilePage();
initUploadPage();
