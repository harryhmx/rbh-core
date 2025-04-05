<template>
  <div class="question-detail">
    <div v-if="question" class="content">
      <div class="header">
        <h1>Question {{ questionNumber }}</h1>
        <button class="btn-secondary" @click="$router.push(`/programs/${question.program}`)">Back to Program</button>
      </div>

      <div class="question-content">
        <h2>Content</h2>
        <p>{{ question.content }}</p>
      </div>

      <div class="answer-section">
        <h2>Your Answer</h2>
        <form @submit.prevent="submitAnswer">
          <div class="form-group">
            <textarea 
              v-model="answer" 
              rows="5" 
              placeholder="Enter your answer here..."
              required
            ></textarea>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-primary" :disabled="isSubmitting">
              {{ isSubmitting ? 'Submitting...' : 'Submit Answer' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-else class="loading">
      Loading...
    </div>
  </div>
</template>

<script>
import { userAPI, questionAPI, solveAPI } from '@/services/api';

export default {
  name: 'QuestionDetail',
  data() {
    return {
      question: null,
      answer: '',
      isSubmitting: false,
      currentUser: null,
      questionNumber: 1,
      totalQuestions: 0
    };
  },
  async created() {
    await this.checkLoginStatus();
    if (this.isLoggedIn) {
      await this.fetchQuestionData();
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
    async fetchQuestionData() {
      try {
        const response = await questionAPI.getQuestion(this.$route.params.id);
        this.question = response.data;
        
        // Get all questions of this program to calculate question number
        const questionsResponse = await questionAPI.getQuestions();
        const programQuestions = questionsResponse.data.filter(q => q.program === this.question.program);
        this.totalQuestions = programQuestions.length;
        this.questionNumber = programQuestions.findIndex(q => q.id === this.question.id) + 1;
      } catch (error) {
        console.error('Failed to fetch question:', error);
        alert('Failed to fetch question details');
      }
    },
    async submitAnswer() {
      if (!this.answer.trim()) return;
      
      this.isSubmitting = true;
      try {
        await solveAPI.createSolve({
          user: this.currentUser.id,
          question: this.question.id,
          answer: this.answer
        });

        // Get next question
        const questionsResponse = await questionAPI.getQuestions();
        const programQuestions = questionsResponse.data.filter(q => q.program === this.question.program);
        const currentIndex = programQuestions.findIndex(q => q.id === this.question.id);
        
        if (currentIndex < programQuestions.length - 1) {
          // If there is a next question, navigate to it
          this.$router.push(`/questions/${programQuestions[currentIndex + 1].id}`);
        } else {
          // If this is the last question, return to program page
          this.$router.push(`/programs/${this.question.program}`);
        }
      } catch (error) {
        console.error('Failed to submit answer:', error);
        alert('Failed to submit answer');
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
</script>

<style scoped>
.question-detail {
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

.question-content,
.answer-section {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
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