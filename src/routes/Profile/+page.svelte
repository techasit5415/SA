<script>
    import { goto } from '$app/navigation';
    let firstName = '';
    let lastName = '';
    let mobileNumber = '';
    let email = '';
    let currentPassword = '';
    let newPassword = '';
    function goBack() {
        goto('Menu');
    }
    function saveProfile() {
        alert('Profile saved successfully!');
    }

    function verifyEmail() {
        alert('Verification email sent!');
    }

    function saveEmail() {
        alert('Email updated successfully!');
    }

    function savePassword() {
        alert('Password updated successfully!');
    }
</script>

<div class="profile-page">
    <section class="profile-section">
        <button class="back-button" on:click={goBack}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="#333"/>
            </svg>
        </button>
        <h2>My Profile</h2>
        <div class="form-group">
            <input type="text" placeholder="First Name" bind:value={firstName} />
        </div>
        <div class="form-group">
            <input type="text" placeholder="Last Name" bind:value={lastName} />
        </div>
        <div class="form-group">
            <input type="text" placeholder="Mobile Number" bind:value={mobileNumber} />
        </div>
        <button class="save-button" on:click={saveProfile}>Save</button>
    </section>

    <hr />

    <section class="email-section">
        <h2>Email</h2>
        <div class="form-group">
            <input type="email" placeholder="Email" bind:value={email} />
        </div>
        <div class="button-group">
            <button class="verify-button" on:click={verifyEmail}>Verify Email</button>
            <button class="save-button" on:click={saveEmail}>Save</button>
        </div>
    </section>

    <hr />

    <section class="password-section">
        <h2>Password</h2>
        <div class="form-group">
            <input type="password" placeholder="Current Password" bind:value={currentPassword} />
        </div>
        <div class="form-group">
            <input type="password" placeholder="New Password" bind:value={newPassword} />
        </div>
        <button class="save-button" on:click={savePassword}>Save</button>
    </section>
</div>

<style>
    .profile-page {
        max-width: 400px;
        margin: 0 auto;
        padding: 20px;
        font-family: Arial, sans-serif;
    }

    h2 {
        font-size: 20px;
        margin-bottom: 15px;
        color: #333;
    }

    .form-group {
        margin-bottom: 15px;
    }
    .back-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 5px;
      margin-right: 15px;
  }
  .back-button svg {
      width: 24px;
      height: 24px;
  }
    .form-group input {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 14px;
        background-color: #f5f5f5;
    }

    .save-button {
        width: 100%;
        padding: 10px;
        background-color: #795548;
        color: white;
        border: none;
        border-radius: 5px;
        font-size: 14px;
        cursor: pointer;
        margin-top: 10px;
    }

    .save-button:hover {
        background-color: #5d4037;
    }

    .verify-button {
        background-color: #795548;
        color: white;
        border: none;
        border-radius: 5px;
        padding: 10px 20px;
        font-size: 14px;
        cursor: pointer;
    }

    .verify-button:hover {
        background-color: #5d4037;
    }

    .button-group {
        display: flex;
        gap: 10px;
    }

    hr {
        border: none;
        border-top: 1px solid #ddd;
        margin: 20px 0;
    }
</style>