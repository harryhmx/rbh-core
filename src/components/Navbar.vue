<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <router-link to="/" class="navbar-item">
        Learning Management System
      </router-link>
    </div>
    <div class="navbar-menu">
      <router-link to="/users" class="navbar-item">Users</router-link>
      <router-link to="/programs" class="navbar-item">Programs</router-link>
      <router-link to="/questions" class="navbar-item">Questions</router-link>
      <router-link to="/learns" class="navbar-item">Learning Records</router-link>
      <router-link to="/solves" class="navbar-item">Solve Records</router-link>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar'
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2c3e50;
  padding: 0 20px;
  height: 60px;
  color: white;
}

.navbar-brand {
  font-size: 1.5rem;
  font-weight: bold;
}

.navbar-menu {
  display: flex;
}

.navbar-item {
  color: white;
  text-decoration: none;
  padding: 0 15px;
  height: 60px;
  display: flex;
  align-items: center;
  transition: background-color 0.3s;
}

.navbar-item:hover {
  background-color: #34495e;
}

.router-link-active {
  background-color: #34495e;
  border-bottom: 3px solid #42b983;
}
</style> 