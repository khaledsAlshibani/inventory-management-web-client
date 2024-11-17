import { deleteUserProfile, getUserProfile, updateUserProfile } from "../api/user.mjs";
import { logout } from "../utils/auth.mjs";

async function renderUserProfile() {
    const profileContainer = document.querySelector('[data-profile]');

    try {
        const user = await getUserProfile();

        // Dynamically generate form inputs for each property except 'id', 'updatedAt', and 'createdAt'
        const formFields = Object.entries(user)
            .filter(([key]) => key !== 'id' && key !== 'updatedAt' && key !== 'createdAt') // Exclude 'id', 'updatedAt', and 'createdAt'
            .map(([key, value]) => {
                if (key === 'email') {
                    // Email is editable but required
                    return `
                        <label>
                            <strong>${capitalize(key)}:</strong>
                            <input type="email" name="${key}" value="${value || ''}" required />
                        </label>
                    `;
                } else if (typeof value === 'string' && value.length > 50) {
                    // Use a textarea for longer strings
                    return `
                        <label>
                            <strong>${capitalize(key)}:</strong>
                            <textarea name="${key}">${value || ''}</textarea>
                        </label>
                    `;
                } else {
                    // Use a standard input for other fields
                    return `
                        <label>
                            <strong>${capitalize(key)}:</strong>
                            <input type="text" name="${key}" value="${value || ''}" />
                        </label>
                    `;
                }
            })
            .join('');

        profileContainer.innerHTML = `
            <form class="profile-form">
                ${formFields}
                <div class="profile-actions">
                    <button type="button" class="btn btn--update">Update</button>
                    <button type="button" class="btn btn--delete">Delete</button>
                </div>
            </form>
        `;

        const form = profileContainer.querySelector('.profile-form');

        // Handle Update
        form.querySelector('.btn--update').addEventListener('click', async () => {
            const formData = new FormData(form);
            const updatedData = {};
            formData.forEach((value, key) => {
                updatedData[key] = value;
            });

            // Ensure 'email' is included
            if (!updatedData.email) {
                alert('Email is required.');
                return;
            }

            try {
                await updateUserProfile(updatedData);
                alert('Profile updated successfully!');
            } catch (error) {
                console.error('Error updating profile:', error);
                alert('Failed to update profile.');
            }
        });

        // Handle Delete
        form.querySelector('.btn--delete').addEventListener('click', async () => {
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

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).replace(/_/g, ' ');
}

renderUserProfile();
