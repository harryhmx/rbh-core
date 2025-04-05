<template>
  <div class="program-detail">
    <div v-if="program" class="content">
      <div class="header">
        <h1>{{ program.title }}</h1>
        <button class="btn-secondary" @click="$router.push('/')">Back to Home</button>
      </div>

      <div class="program-info">
        <div class="info-item">
          <span class="label">Level:</span>
          <span class="value">{{ program.level }}</span>
        </div>
        <div class="info-item">
          <span class="label">Minimum Score:</span>
          <span class="value">{{ program.min_score }}</span>
        </div>
      </div>

      <div class="program-content">
        <h2>Content</h2>
        <p>{{ program.content }}</p>
      </div>

      <div class="action-section">
        <button 
          v-if="!hasJoined" 
          class="btn-primary" 
          @click="joinProgram"
          :disabled="!canJoin"
        >
          Join Program
        </button>
        <p v-else class="joined-message">You have joined this program</p>
        <p v-if="!canJoin" class="requirement-message">
          You need to reach level {{ program.level }} and score {{ program.min_score }} to join this program
        </p>
      </div>
    </div>

    <div v-else class="loading">
      Loading...
    </div>
  </div>
</template>

<script>
import { userAPI, questionAPI, programAPI, learnAPI } from '@/services/api';

export default {
  name: 'ProgramDetail',
  data() {
    return {
      program: null,
      hasJoined: false,
      currentUser: null
    };
  },
  computed: {
    canJoin() {
      if (!this.currentUser || !this.program) return false;
      return this.currentUser.level >= this.program.level && 
             this.currentUser.score >= this.program.min_score;
    }
  },
  async created() {
    await this.checkLoginStatus();
    if (this.isLoggedIn) {
      await this.fetchProgramData();
      await this.checkJoinStatus();
    } else {
      this.$router.push('/');
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
    async fetchProgramData() {
      try {
        const response = await programAPI.getProgram(this.$route.params.id);
        this.program = response.data;
      } catch (error) {
        console.error('Failed to fetch program:', error);
        alert('Failed to fetch program details');
      }
    },
    async checkJoinStatus() {
      try {
        const response = await learnAPI.getLearns();
        const userLearns = response.data.filter(learn => 
          learn.user === this.currentUser.id && 
          learn.program === this.program.id
        );
        this.hasJoined = userLearns.length > 0;
      } catch (error) {
        console.error('Failed to check join status:', error);
      }
    },
    async joinProgram() {
      if (!this.canJoin) return;
      
      try {
        await learnAPI.createLearn({
          user: this.currentUser.id,
          program: this.program.id
        });
        this.hasJoined = true;
        
        // Get the first question of this program
        const questionsResponse = await questionAPI.getQuestions();
        const programQuestions = questionsResponse.data.filter(q => q.program === this.program.id);
        if (programQuestions.length > 0) {
          this.$router.push(`/questions/${programQuestions[0].id}`);
        }
      } catch (error) {
        console.error('Failed to join program:', error);
        alert('Failed to join program');
      }
    }
  }
};
</script>

<style scoped>
.program-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.program-info {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.label {
  font-weight: 600;
}

.program-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

.action-section {
  text-align: center;
  margin-top: 30px;
}

.joined-message {
  color: #42b983;
  font-weight: 600;
}

.requirement-message {
  color: #dc3545;
  margin-top: 10px;
}

.loading {
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

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style> 