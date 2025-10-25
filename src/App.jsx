import { useState, useEffect } from 'react';
import { 
  Menu, X, CloudRain, MapPin, Calendar, User, LogOut, MessageCircle,
  ChevronLeft, ChevronRight, Search, Filter, Eye, Plus, Upload, AlertCircle
} from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { incidentsService, newsService, slidesService, linksService } from './services/api';

function App() {
  // Estado de autenticação
  const { user, login, register, logout, isAuthenticated } = useAuth();

  // Estados da UI
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showReportIncident, setShowReportIncident] = useState(false);
  const [showIncidentDetails, setShowIncidentDetails] = useState(false);
  const [showViewAll, setShowViewAll] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [viewAllCategory, setViewAllCategory] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Estados de dados
  const [incidents, setIncidents] = useState([]);
  const [news, setNews] = useState([]);
  const [slides, setSlides] = useState([]);
  const [links, setLinks] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [weather, setWeather] = useState(null);

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  // Estados de formulários
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '', email: '', phone: '', password: '', consentGiven: false
  });
  const [incidentForm, setIncidentForm] = useState({
    title: '', description: '', location: '', gps: '', photos: []
  });

  // Carregar dados ao iniciar
  useEffect(() => {
    loadIncidents();
    loadNews();
    loadSlides();
    loadLinks();
    loadWeather();
  }, []);

  // Slideshow automático
  useEffect(() => {
    if (slides.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [slides.length]);

  // Funções de carregamento de dados
  const loadIncidents = async () => {
    try {
      const response = await incidentsService.getPublic();
      setIncidents(response.data.data.incidents || []);
    } catch (error) {
      console.error('Erro ao carregar incidências:', error);
    }
  };

  const loadNews = async () => {
    try {
      const response = await newsService.getAll();
      setNews(response.data.data.news || []);
    } catch (error) {
      console.error('Erro ao carregar notícias:', error);
    }
  };

  const loadSlides = async () => {
    try {
      const response = await slidesService.getAll();
      const activeSlides = response.data.data.slides.filter(s => s.active);
      setSlides(activeSlides.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Erro ao carregar slides:', error);
    }
  };

  const loadLinks = async () => {
    try {
      const response = await linksService.getAll();
      const activeLinks = response.data.data.links.filter(l => l.active);
      setLinks(activeLinks.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Erro ao carregar links:', error);
    }
  };

  const loadWeather = async () => {
    // Simulação de dados meteorológicos para Ponte de Lima
    setWeather({
      temp: 18,
      condition: 'Parcialmente nublado',
      humidity: 65,
      wind: 12,
      location: 'Ponte de Lima'
    });
  };

  // Funções de autenticação
  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(loginForm.email, loginForm.password);
    if (result.success) {
      setShowLogin(false);
      setLoginForm({ email: '', password: '' });
      alert('Login efetuado com sucesso!');
    } else {
      alert(result.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const result = await register(registerForm);
    if (result.success) {
      setShowRegister(false);
      setRegisterForm({ name: '', email: '', phone: '', password: '', consentGiven: false });
      alert('Conta criada! Verifique o seu email para ativar.');
    } else {
      alert(result.message);
    }
  };

  const handleLogout = () => {
    logout();
    alert('Sessão terminada!');
  };

  // Função de reportar incidência
  const handleReportIncident = async (e) => {
    e.preventDefault();
    try {
      await incidentsService.create(incidentForm);
      setShowReportIncident(false);
      setIncidentForm({ title: '', description: '', location: '', gps: '', photos: [] });
      alert('Incidência reportada com sucesso!');
      loadIncidents();
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao reportar incidência');
    }
  };

  // Filtrar incidências
  const filterIncidents = (incidentsList) => {
    return incidentsList.filter(incident => {
      const matchesSearch = !searchTerm || 
        incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLocation = !filterLocation || 
        incident.location.toLowerCase().includes(filterLocation.toLowerCase());
      
      const incidentDate = new Date(incident.createdAt);
      const matchesDateFrom = !filterDateFrom || incidentDate >= new Date(filterDateFrom);
      const matchesDateTo = !filterDateTo || incidentDate <= new Date(filterDateTo);

      return matchesSearch && matchesLocation && matchesDateFrom && matchesDateTo;
    });
  };

  // Categorizar incidências
  const categorizeIncidents = () => {
    return {
      pending: filterIncidents(incidents.filter(i => i.status === 'pending')),
      analyzing: filterIncidents(incidents.filter(i => i.status === 'analyzing')),
      inProgress: filterIncidents(incidents.filter(i => i.status === 'inProgress')),
      resolved: filterIncidents(incidents.filter(i => i.status === 'resolved'))
    };
  };

  const categorized = categorizeIncidents();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <MapPin className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">Portal da Freguesia</h1>
                <p className="text-sm text-blue-100">Transparência e Proximidade</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#inicio" className="hover:text-blue-200 transition">Início</a>
              <a href="#incidencias" className="hover:text-blue-200 transition">Incidências</a>
              <a href="#noticias" className="hover:text-blue-200 transition">Notícias</a>
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm">Olá, {user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowLogin(true)}
                    className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded transition font-medium"
                  >
                    Entrar
                  </button>
                  <button
                    onClick={() => setShowRegister(true)}
                    className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded transition"
                  >
                    Registar
                  </button>
                </div>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 space-y-2">
              <a href="#inicio" className="block py-2 hover:bg-blue-700 rounded px-4">Início</a>
              <a href="#incidencias" className="block py-2 hover:bg-blue-700 rounded px-4">Incidências</a>
              <a href="#noticias" className="block py-2 hover:bg-blue-700 rounded px-4">Notícias</a>
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full text-left py-2 hover:bg-blue-700 rounded px-4"
                >
                  Sair
                </button>
              ) : (
                <>
                  <button
                    onClick={() => { setShowLogin(true); setMobileMenuOpen(false); }}
                    className="w-full text-left py-2 hover:bg-blue-700 rounded px-4"
                  >
                    Entrar
                  </button>
                  <button
                    onClick={() => { setShowRegister(true); setMobileMenuOpen(false); }}
                    className="w-full text-left py-2 hover:bg-blue-700 rounded px-4"
                  >
                    Registar
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Hero Section com Slideshow e Weather */}
      <section id="inicio" className="bg-gradient-to-r from-blue-500 to-blue-700 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Slideshow */}
            <div className="bg-white rounded-lg overflow-hidden shadow-xl">
              {slides.length > 0 ? (
                <div className="relative h-80">
                  <img
                    src={slides[currentSlide]?.image || 'https://via.placeholder.com/800x400'}
                    alt={slides[currentSlide]?.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h3 className="text-white text-xl font-bold">{slides[currentSlide]?.title}</h3>
                  </div>
                  
                  {/* Navigation Arrows */}
                  <button
                    onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-white/50'}`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center bg-gray-200">
                  <p className="text-gray-500">Sem slides disponíveis</p>
                </div>
              )}
            </div>

            {/* Weather Widget */}
            <div className="bg-white rounded-lg p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-800">Meteorologia</h3>
                <CloudRain className="w-8 h-8 text-blue-500" />
              </div>
              
              {weather && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    <span className="font-medium">{weather.location}</span>
                  </div>
                  
                  <div className="text-6xl font-bold text-blue-600">{weather.temp}°C</div>
                  <div className="text-xl text-gray-700">{weather.condition}</div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-500">Humidade</p>
                      <p className="text-lg font-semibold">{weather.humidity}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Vento</p>
                      <p className="text-lg font-semibold">{weather.wind} km/h</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Botão Reportar */}
              <button
                onClick={() => setShowReportIncident(true)}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition"
                disabled={!isAuthenticated}
              >
                <Plus className="w-5 h-5" />
                <span>Reportar Incidência</span>
              </button>
              {!isAuthenticated && (
                <p className="text-sm text-gray-500 text-center mt-2">
                  Faça login para reportar incidências
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Estatísticas Rápidas */}
      <section className="py-6 bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{categorized.pending.length}</div>
              <div className="text-sm text-gray-600">Pendentes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{categorized.analyzing.length}</div>
              <div className="text-sm text-gray-600">Em Análise</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{categorized.inProgress.length}</div>
              <div className="text-sm text-gray-600">Em Resolução</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{categorized.resolved.length}</div>
              <div className="text-sm text-gray-600">Resolvidas</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filtros */}
      <section className="py-6 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="bg-white p-4 rounded-lg shadow flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Pesquisar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Pesquisar por título..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Localização</label>
              <input
                type="text"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                placeholder="Filtrar por local..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
              <input
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
              <input
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={() => {
                setSearchTerm('');
                setFilterLocation('');
                setFilterDateFrom('');
                setFilterDateTo('');
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </section>

      {/* Incidências - 4 Colunas */}
      <section id="incidencias" className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Incidências Reportadas</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            {/* Coluna 1: Pendentes */}
            <IncidentColumn
              title="Pendentes"
              incidents={categorized.pending.slice(0, 5)}
              color="yellow"
              total={categorized.pending.length}
              onViewAll={() => { setViewAllCategory('pending'); setShowViewAll(true); }}
              onViewDetails={(incident) => { setSelectedIncident(incident); setShowIncidentDetails(true); }}
            />

            {/* Coluna 2: Em Análise */}
            <IncidentColumn
              title="Em Análise"
              incidents={categorized.analyzing.slice(0, 5)}
              color="blue"
              total={categorized.analyzing.length}
              onViewAll={() => { setViewAllCategory('analyzing'); setShowViewAll(true); }}
              onViewDetails={(incident) => { setSelectedIncident(incident); setShowIncidentDetails(true); }}
            />

            {/* Coluna 3: Em Resolução */}
            <IncidentColumn
              title="Em Resolução"
              incidents={categorized.inProgress.slice(0, 5)}
              color="orange"
              total={categorized.inProgress.length}
              onViewAll={() => { setViewAllCategory('inProgress'); setShowViewAll(true); }}
              onViewDetails={(incident) => { setSelectedIncident(incident); setShowIncidentDetails(true); }}
            />

            {/* Coluna 4: Resolvidas */}
            <IncidentColumn
              title="Resolvidas"
              incidents={categorized.resolved.slice(0, 5)}
              color="green"
              total={categorized.resolved.length}
              onViewAll={() => { setViewAllCategory('resolved'); setShowViewAll(true); }}
              onViewDetails={(incident) => { setSelectedIncident(incident); setShowIncidentDetails(true); }}
            />
          </div>
        </div>
      </section>

      {/* Notícias e Eventos */}
      <section id="noticias" className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Notícias e Eventos</h2>
          
          {news.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {news.filter(n => n.published).slice(0, 6).map((item) => (
                <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(item.publishDate || item.createdAt).toLocaleDateString('pt-PT')}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                    <p className="text-gray-600 mb-4">{item.excerpt}</p>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                      Ler mais →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500">Sem notícias disponíveis no momento</p>
            </div>
          )}
        </div>
      </section>

      {/* Links Úteis */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Links Úteis</h2>
          
          {links.length > 0 ? (
            <div className="grid md:grid-cols-4 gap-4">
              {links.map((link) => (
                <a
                  key={link._id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center"
                >
                  <div className="text-blue-600 font-semibold">{link.title}</div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500">Sem links disponíveis no momento</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Portal da Freguesia</h3>
              <p className="text-gray-300">Transparência e proximidade com os cidadãos.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contactos</h3>
              <p className="text-gray-300">Email: geral@freguesia.pt</p>
              <p className="text-gray-300">Tel: +351 258 000 000</p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Horário</h3>
              <p className="text-gray-300">Segunda a Sexta: 9h - 17h</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 União de Freguesias. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Chat Flutuante */}
      <button
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg z-50 transition"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {showChat && (
        <div className="fixed bottom-24 right-6 bg-white rounded-lg shadow-2xl w-80 z-50">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold">Suporte</h3>
            <button onClick={() => setShowChat(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 h-64 overflow-y-auto">
            <p className="text-gray-600 text-sm">Olá! Como podemos ajudar?</p>
          </div>
          <div className="p-4 border-t">
            <input
              type="text"
              placeholder="Escreva a sua mensagem..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Modais */}
      <LoginModal
        show={showLogin}
        onClose={() => setShowLogin(false)}
        form={loginForm}
        setForm={setLoginForm}
        onSubmit={handleLogin}
      />

      <RegisterModal
        show={showRegister}
        onClose={() => setShowRegister(false)}
        form={registerForm}
        setForm={setRegisterForm}
        onSubmit={handleRegister}
      />

      <ReportIncidentModal
        show={showReportIncident}
        onClose={() => setShowReportIncident(false)}
        form={incidentForm}
        setForm={setIncidentForm}
        onSubmit={handleReportIncident}
      />

      <IncidentDetailsModal
        show={showIncidentDetails}
        onClose={() => setShowIncidentDetails(false)}
        incident={selectedIncident}
      />

      <ViewAllModal
        show={showViewAll}
        onClose={() => setShowViewAll(false)}
        category={viewAllCategory}
        incidents={categorized[viewAllCategory] || []}
        onViewDetails={(incident) => {
          setShowViewAll(false);
          setSelectedIncident(incident);
          setShowIncidentDetails(true);
        }}
      />
    </div>
  );
}

// Componente de Coluna de Incidências
function IncidentColumn({ title, incidents, color, total, onViewAll, onViewDetails }) {
  const colorClasses = {
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    blue: 'bg-blue-100 text-blue-800 border-blue-300',
    orange: 'bg-orange-100 text-orange-800 border-orange-300',
    green: 'bg-green-100 text-green-800 border-green-300',
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className={`${colorClasses[color]} p-4 border-b-2`}>
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-sm opacity-75">{total} incidências</p>
      </div>
      
      <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
        {incidents.length > 0 ? (
          incidents.map((incident) => (
            <div
              key={incident._id}
              onClick={() => onViewDetails(incident)}
              className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition cursor-pointer"
            >
              <h4 className="font-semibold text-gray-800 mb-1">{incident.title}</h4>
              <div className="flex items-center text-xs text-gray-500 mb-2">
                <MapPin className="w-3 h-3 mr-1" />
                {incident.location}
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(incident.createdAt).toLocaleDateString('pt-PT')}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm text-center py-4">
            Sem incidências
          </p>
        )}
      </div>

      {total > 5 && (
        <div className="p-4 border-t">
          <button
            onClick={onViewAll}
            className="w-full bg-gray-100 hover:bg-gray-200 py-2 rounded-lg text-sm font-medium text-gray-700 transition flex items-center justify-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>Ver todas ({total})</span>
          </button>
        </div>
      )}
    </div>
  );
}

// Modal de Login
function LoginModal({ show, onClose, form, setForm, onSubmit }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Entrar</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

// Modal de Registo
function RegisterModal({ show, onClose, form, setForm, onSubmit }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Criar Conta</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+351..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres, com maiúsculas, minúsculas, números e símbolos</p>
          </div>

          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              checked={form.consentGiven}
              onChange={(e) => setForm({ ...form, consentGiven: e.target.checked })}
              required
              className="mt-1"
            />
            <label className="text-sm text-gray-700">
              Aceito os termos e condições e a política de privacidade (RGPD)
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Criar Conta
          </button>
        </form>
      </div>
    </div>
  );
}

// Modal de Reportar Incidência
function ReportIncidentModal({ show, onClose, form, setForm, onSubmit }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Reportar Incidência</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              placeholder="Ex: Buraco na estrada"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              rows={4}
              placeholder="Descreva a situação..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Localização</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              required
              placeholder="Ex: Rua Principal, nº 123"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Coordenadas GPS (opcional)</label>
            <input
              type="text"
              value={form.gps}
              onChange={(e) => setForm({ ...form, gps: e.target.value })}
              placeholder="Ex: 41.7678, -8.5839"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fotos (URLs)</label>
            <div className="space-y-2">
              <input
                type="url"
                placeholder="URL da foto 1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => {
                  if (e.target.value) {
                    setForm({ ...form, photos: [e.target.value] });
                  }
                }}
              />
              <p className="text-xs text-gray-500">
                <AlertCircle className="w-3 h-3 inline mr-1" />
                Por agora, cole a URL de uma foto hospedada online
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center space-x-2"
          >
            <Upload className="w-5 h-5" />
            <span>Submeter Incidência</span>
          </button>
        </form>
      </div>
    </div>
  );
}

// Modal de Detalhes da Incidência
function IncidentDetailsModal({ show, onClose, incident }) {
  if (!show || !incident) return null;

  const statusLabels = {
    pending: 'Pendente',
    analyzing: 'Em Análise',
    inProgress: 'Em Resolução',
    resolved: 'Resolvida'
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{incident.title}</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
              {statusLabels[incident.status]}
            </span>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Descrição:</h3>
            <p className="text-gray-600">{incident.description}</p>
          </div>

          <div className="flex items-start space-x-2 text-gray-600">
            <MapPin className="w-5 h-5 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-700">Localização:</h3>
              <p>{incident.location}</p>
              {incident.gps && (
                <p className="text-sm text-gray-500 mt-1">GPS: {incident.gps}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="w-5 h-5" />
            <div>
              <h3 className="font-semibold text-gray-700">Data de Reporte:</h3>
              <p>{new Date(incident.createdAt).toLocaleDateString('pt-PT', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>
          </div>

          {incident.resolvedDate && (
            <div className="flex items-center space-x-2 text-green-600">
              <Calendar className="w-5 h-5" />
              <div>
                <h3 className="font-semibold">Data de Resolução:</h3>
                <p>{new Date(incident.resolvedDate).toLocaleDateString('pt-PT', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
            </div>
          )}

          {incident.photos && incident.photos.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Fotos:</h3>
              <div className="grid grid-cols-2 gap-4">
                {incident.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Modal de Ver Todas
function ViewAllModal({ show, onClose, category, incidents, onViewDetails }) {
  if (!show) return null;

  const categoryTitles = {
    pending: 'Pendentes',
    analyzing: 'Em Análise',
    inProgress: 'Em Resolução',
    resolved: 'Resolvidas'
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Incidências {categoryTitles[category]} ({incidents.length})
          </h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <div className="space-y-3">
          {incidents.map((incident) => (
            <div
              key={incident._id}
              onClick={() => onViewDetails(incident)}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">{incident.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{incident.description.substring(0, 100)}...</p>
                  <div className="flex items-center text-xs text-gray-500 space-x-4">
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {incident.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(incident.createdAt).toLocaleDateString('pt-PT')}
                    </div>
                  </div>
                </div>
                <Eye className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
