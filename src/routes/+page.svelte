<script>
  import { goto } from '$app/navigation';

  function handleLogin(provider) {
      console.log(`Continue with ${provider}`);
      goto('/Menu'); // ไปยังหน้า Menu
  }

  function handleSignUp() {
      console.log('Sign up clicked');
      showRegisterForm = true; // แสดงฟอร์มสมัครสมาชิก
  }

  function handleLogIn() {
      console.log('Log in clicked');
      showLoginForm = true; // แสดงฟอร์มเข้าสู่ระบบ
  }

  function submitRegister() {
      console.log('Register submitted');
      showRegisterForm = false; // ปิดฟอร์มสมัครสมาชิก
      showLoginForm = true; // เปิดฟอร์มเข้าสู่ระบบ
  }

  function submitLogin() {
      console.log('Log in submitted');
      goto('/Menu'); // ไปยังหน้า Menu
  }

  let showRegisterForm = false; // state สำหรับแสดงฟอร์มสมัครสมาชิก
  let showLoginForm = false; // state สำหรับแสดงฟอร์มเข้าสู่ระบบ
</script>

{#if showRegisterForm}
  <!-- ฟอร์มสมัครสมาชิก -->
  <div class="modal register-modal">
      <h1>Register</h1>
      <form on:submit|preventDefault={submitRegister}>
          <div class="form-group">
              <label for="name">Name</label>
              <input id="name" type="text" placeholder="Enter your name" required />
          </div>
          <div class="form-group">
              <label for="email">Email</label>
              <input id="email" type="email" placeholder="Enter your email" required />
          </div>
          <div class="form-group">
              <label for="password">Password</label>
              <input id="password" type="password" placeholder="Enter your password" required />
          </div>
          <button type="submit" class="auth-button signup">Register</button>
          <button type="button" class="auth-button back" on:click={() => showRegisterForm = false}>Back</button>
      </form>
  </div>
{:else if showLoginForm}
  <!-- ฟอร์มเข้าสู่ระบบ -->
  <div class="modal login-modal">
      <h1>Log In</h1>
      <form on:submit|preventDefault={submitLogin}>
          <div class="form-group">
              <label for="email">Email</label>
              <input id="email" type="email" placeholder="Enter your email" required />
          </div>
          <div class="form-group">
              <label for="password">Password</label>
              <input id="password" type="password" placeholder="Enter your password" required />
          </div>
          <button type="submit" class="auth-button login">Log In</button>
          <button type="button" class="auth-button back" on:click={() => showLoginForm = false}>Back</button>
      </form>
  </div>
{:else}
  <!-- Modal สำหรับการเข้าสู่ระบบ -->
  <div class="modal auth-modal">
      <h1>Welcome!</h1>
      <p>Sign up or log in to continue</p>

      <div class="auth-buttons">
          <button class="auth-button facebook" on:click={() => handleLogin('Facebook')}>
              Continue with Facebook
          </button>
          <button class="auth-button google" on:click={() => handleLogin('Google')}>
              Continue with Google
          </button>
          <button class="auth-button apple" on:click={() => handleLogin('Apple')}>
              Continue with Apple
          </button>
      </div>

      <hr />

      <div class="auth-actions">
          <button class="auth-button login" on:click={handleLogIn}>Log In</button>
          <button class="auth-button signup" on:click={handleSignUp}>Register</button>
      </div>
  </div>
{/if}

<style>
  /* สไตล์สำหรับ modal */
  .modal {
      width: 400px;
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      text-align: center;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
  }

  body, html {
      margin: 0;
      padding: 0;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f5f5f5;
  }

  h1 {
      font-size: 24px;
      margin-bottom: 10px;
  }

  p {
      font-size: 14px;
      color: #666;
      margin-bottom: 20px;
  }

  .auth-buttons, .auth-actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
  }

  .auth-button {
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s ease;
  }

  .auth-button.facebook {
      background: #1877f2;
      color: white;
  }

  .auth-button.google {
      background: white;
      color: #333;
      border: 1px solid #ddd;
  }

  .auth-button.apple {
      background: black;
      color: white;
  }

  .auth-button.signup {
      background: #795548;
      color: white;
  }

  .auth-button.login {
      background: #4CAF50;
      color: white;
  }

  .auth-button.back {
      background: white;
      color: #795548;
      border: 1px solid #795548;
  }

  .auth-button:hover {
      opacity: 0.9;
  }

  .form-group {
      margin-bottom: 15px;
      text-align: left;
  }

  .form-group label {
      display: block;
      margin-bottom: 5px;
      font-size: 14px;
      color: #333;
  }

  .form-group input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 14px;
  }
</style>