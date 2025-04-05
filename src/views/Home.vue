<template>
  <div class="home">
    <!-- Display login form when not logged in -->
    <div v-if="!isLoggedIn" class="login-container">
      <h1>Welcome to Learning Management System</h1>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" v-model="loginForm.username" required>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="loginForm.password" required>
        </div>
        <button type="submit" class="btn-primary">Login</button>
      </form>
    </div>

    <!-- Display program list when logged in -->
    <div v-else class="program-list">
      <h1>Available Programs</h1>
      <div class="program-grid">
        <div v-for="program in availablePrograms" :key="program.id" class="program-card">
          <h2>{{ program.title }}</h2>
          <p class="program-level">Level: {{ program.level }}</p>
          <p class="program-min-score">Minimum Score: {{ program.min_score }}</p>
          <button class="btn-primary" @click="viewProgram(program.id)">View Details</button>
        </div>
      </div>
      <div v-if="availablePrograms.length === 0" class="empty-message">
        No programs available for your level
      </div>
    </div>
  </div>
</template>

<script>
import { userAPI, programAPI } from '@/services/api';

export default {
  name: 'HomePage',
  data() {
    return {
      isLoggedIn: false,
      currentUser: null,
      programs: [],
      loginForm: {
        username: '',
        password: ''
      }
    };
  },
  computed: {
    availablePrograms() {
      if (!this.currentUser) return [];
      return this.programs.filter(program => 
        program.level <= this.currentUser.level && 
        program.min_score <= this.currentUser.score
      );
    }
  },
  created() {
    this.checkLoginStatus();
    if (this.isLoggedIn) {
      this.fetchPrograms();
    }
  },
  methods: {
    async checkLoginStatus() {
      try {
        const response = await userAPI.getCurrentUser();
        this.currentUser = response.data;
        this.isLoggedIn = true;
      } catch (error) {
        this.isLoggedIn = false;
        this.currentUser = null;
      }
    },
    async handleLogin() {
      try {
        const response = await userAPI.login(this.loginForm);
        this.currentUser = response.data;
        this.isLoggedIn = true;
        this.fetchPrograms();
      } catch (error) {
        console.error('Login failed:', error);
        alert('Login failed. Please check your credentials.');
      }
    },
    async fetchPrograms() {
      try {
        const response = await programAPI.getPrograms();
        this.programs = response.data;
      } catch (error) {
        console.error('Failed to fetch programs:', error);
      }
    },
    viewProgram(id) {
      this.$router.push(`/programs/${id}`);
    }
  }
};
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.login-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group label {
  font-weight: 600;
}

.form-group input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.program-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.program-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.program-level,
.program-min-score {
  color: #666;
  font-size: 0.9em;
}

.empty-message {
  text-align: center;
  padding: 40px;
  color: #666;
}

button {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background-color: #42b983;
  color: white;
}
</style> 