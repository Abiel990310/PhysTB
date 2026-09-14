import './styles/index.css';
import { TbMemviz } from './components/memviz.ts';
import { TbQuiz } from './components/quiz.ts';
import { TbGraph } from './components/graph.ts';
import { setupSearch } from './lib/search.ts';
import {
  setupProblemFilters,
  setupProgress,
  setupScrollSpy,
  setupSidebar,
  setupTheme,
} from './lib/site.ts';

customElements.define('tb-memviz', TbMemviz);
customElements.define('tb-quiz', TbQuiz);
customElements.define('tb-graph', TbGraph);

setupTheme();
setupSidebar();
setupScrollSpy();
setupProgress();
setupProblemFilters();
setupSearch();
