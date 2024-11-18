import { deleteUserProfile, getUserProfile, updateUserProfile } from "../api/user.mjs";
import { logout } from "../utils/auth.mjs";
import { capitalize } from "../utils/typography.mjs";
import { Button, Input } from "../utils/ui.mjs";

async function renderUserProfile() {
    const profileContainer = document.querySelector('[data-profile]');

    try {
        const user = await getUserProfile();

        if (user.birthdate) {
            displayUserAge(user.birthdate);
        }
        if (user.photoPath) {
            getUserImage(user.photoPath);
        }

        const formFields = Object.entries(user)
            .filter(
                ([key]) =>
                    key !== "id" &&
                    key !== "updatedAt" &&
                    key !== "createdAt" &&
                    key !== "password" &&
                    key !== "photoPath"
            )
            .map(([key, value]) => {
                const typeMap = {
                    email: "email",
                    name: "text",
                    username: "text",
                    birthdate: "date",
                };

                const type = typeMap[key] || "text";
                const required = key === "email";

                return Input({
                    label: capitalize(key),
                    id: key,
                    name: key,
                    type,
                    required,
                    value: value || "",
                    placeholder: `Enter your ${key}`,
                    className: "form-control",
                });
            });

        const formInputs = profileContainer.querySelector('[data-profile-inputs]');

        formFields.forEach((field) => {
            formInputs.appendChild(field);
        });

        const buttonsContainer = document.createElement("div");
        buttonsContainer.className = "page-form__buttons";

        const updateButtonEl = Button({
            label: "Update",
            type: "submit",
            variant: "primary",
            iconStart: "user-check",
            iconEnd: false,
            dataAttributes: { "data-update-profile": "" },
        });
        const deleteButtonEl = Button({
            label: "Delete",
            type: "button",
            variant: "delete",
            iconStart: "trash-2",
            iconEnd: false,
            dataAttributes: { "data-delete-profile": "" },
        });

        buttonsContainer.appendChild(updateButtonEl);
        buttonsContainer.appendChild(deleteButtonEl);

        formInputs.appendChild(buttonsContainer);

        // handle update
        formInputs.querySelector('[data-update-profile]').addEventListener('click', async (event) => {
            event.preventDefault();
        
            const form = event.target.closest('form');
            const formData = new FormData(form);
        
            const photoInputElement = document.querySelector('input[type="file"][data-profile-image-input]');
            const photoFile = photoInputElement?.files?.[0] || null;
        
            const updatedData = {};
            formData.forEach((value, key) => {
                if (key !== 'photoPath') {
                    updatedData[key] = value;
                }
            });
        
            try {
                const updatedUserInfo = await updateUserProfile(updatedData, photoFile);
                console.log('Profile updated:', updatedUserInfo);
                alert('Profile updated successfully!');
            } catch (error) {
                console.error('Failed to update profile:', error);
                alert('Failed to update profile.');
            }
        });
        

        // Handle Delete
        formInputs.querySelector('[data-delete-profile]').addEventListener('click', async () => {
            if (confirm('Are you sure you want to delete your account?')) {
                try {
                    await deleteUserProfile();
                    alert('Account deleted successfully!');
                    logout();
                } catch (error) {
                    console.error('Error deleting account:', error);
                    alert('Failed to delete account.');
                }
            }
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        profileContainer.innerHTML = `<p class="error">Failed to load profile. Please try again later.</p>`;
    }
}

function displayUserAge(birthDate) {
    const ageEl = document.querySelector('[data-display-user-age]');

    if (ageEl) {
        const today = new Date();
        const birthdate = new Date(birthDate);
        const age = today.getFullYear() - birthdate.getFullYear();
        ageEl.textContent = `Age: ${age} years old.`;
    }
}

function getUserImage(imagePath) {
    const image = document.querySelector('[data-profile-image]');

    if (image) {
        image.setAttribute('src', imagePath);
    }
}

function updateUserImage() {
    const image = document.querySelector('[data-profile-image]');
    const imageInput = document.querySelector('[data-profile-image-input]');

    if (image && imageInput) {
        imageInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    image.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

renderUserProfile();
updateUserImage();
