
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "app_title": "Global Football Hub",
      "menu": "Menu",
      "dashboard": "Dashboard",
      "favorites": "Favorites",
      "categories": "Categories",
      "leagues": "Leagues",
      "nations": "Nations",
      "match_center": "Match Center",
      "search_placeholder": "Search player...",
      "suggestions": "Suggestions",
      "recently_viewed": "Recently Viewed",
      "press_enter": "Press Enter to search",
      "filters": "Filters",
      "top": "TOP",
      "all": "All",
      "tabs": {
        "review": "Review",
        "fixtures": "Fixtures",
        "calendar": "Calendar",
        "highlights": "Highlights",
        "insights": "Insights",
        "tactics": "Tactics",
        "predictions": "Predictions",
        "performance": "Performance",
        "betting": "Betting"
      },
      "welcome_title": "Welcome to the Football Hub!",
      "welcome_subtitle": "Select a league or nation from the sidebar to get started.",
      "live": "LIVE",
      "upcoming": "UPCOMING",
      "analyze": "Analyze",
      "expert_verdict": "Expert Verdict",
      "head_to_head": "Head-to-Head Comparison",
      "player": {
        "key_strengths": "Key Strengths",
        "recent_performance": "Recent Performance",
        "queued": "Queued",
        "compare": "Compare",
        "compare_now": "Compare Now",
        "clear": "Clear",
        "selected": "Selected",
        "trait": "Key Trait",
        "top_strengths": "Top Strengths"
      },
      "match": {
        "competition": "Competition",
        "match": "Match",
        "score_time": "Score / Time",
        "status": "Status",
        "verified_sources": "Verified Real-time Sources",
        "forecasts": "AI Match Forecasts",
        "experimental": "Experimental",
        "ai_pick": "AI Pick",
        "confidence": "Confidence",
        "disclaimer": "AI predictions are based on historical trends and statistical modeling. They are for informational purposes only.",
        "pre_match": "Pre-Match",
        "halftime": "Halftime",
        "post_match": "Post-Match"
      }
    }
  },
  es: {
    translation: {
      "app_title": "Eje Global de Fútbol",
      "menu": "Menú",
      "dashboard": "Panel de Control",
      "favorites": "Favoritos",
      "categories": "Categorías",
      "leagues": "Ligas",
      "nations": "Naciones",
      "match_center": "Centro de Partidos",
      "search_placeholder": "Buscar jugador...",
      "suggestions": "Sugerencias",
      "recently_viewed": "Visto Recientemente",
      "press_enter": "Presione Enter para buscar",
      "filters": "Filtros",
      "top": "TOP",
      "all": "Todo",
      "tabs": {
        "review": "Resumen",
        "fixtures": "Resultados",
        "calendar": "Calendario",
        "highlights": "Momentos",
        "insights": "Análisis",
        "tactics": "Tácticas",
        "predictions": "Predicciones",
        "performance": "Rendimiento",
        "betting": "Apuestas"
      },
      "welcome_title": "¡Bienvenido al Eje de Fútbol!",
      "welcome_subtitle": "Selecciona una liga o nación en la barra lateral para comenzar.",
      "live": "VIVO",
      "upcoming": "PRÓXIMO",
      "analyze": "Analizar",
      "expert_verdict": "Veredicto del Experto",
      "head_to_head": "Comparación Directa",
      "player": {
        "key_strengths": "Fortalezas Clave",
        "recent_performance": "Rendimiento Reciente",
        "queued": "En cola",
        "compare": "Comparar",
        "compare_now": "Comparar ahora",
        "clear": "Limpiar",
        "selected": "Seleccionado",
        "trait": "Rasgo Clave",
        "top_strengths": "Mejores Fortalezas"
      },
      "match": {
        "competition": "Competición",
        "match": "Partido",
        "score_time": "Puntaje / Hora",
        "status": "Estado",
        "verified_sources": "Fuentes verificadas en tiempo real",
        "forecasts": "Pronósticos de IA",
        "experimental": "Experimental",
        "ai_pick": "Selección de IA",
        "confidence": "Confianza",
        "disclaimer": "Las predicciones de IA se basan en tendencias históricas. Son solo para fines informativos.",
        "pre_match": "Pre-Partido",
        "halftime": "Medio Tiempo",
        "post_match": "Post-Partido"
      }
    }
  },
  fr: {
    translation: {
      "app_title": "Hub Mondial du Football",
      "menu": "Menu",
      "dashboard": "Tableau de bord",
      "favorites": "Favoris",
      "categories": "Catégories",
      "leagues": "Ligues",
      "nations": "Nations",
      "match_center": "Match Center",
      "search_placeholder": "Chercher un joueur...",
      "suggestions": "Suggestions",
      "recently_viewed": "Consultés récemment",
      "press_enter": "Appuyez sur Entrée pour rechercher",
      "filters": "Filtres",
      "top": "TOP",
      "all": "Tout",
      "tabs": {
        "review": "Revue",
        "fixtures": "Matchs",
        "calendar": "Calendrier",
        "highlights": "Points Forts",
        "insights": "Analyses",
        "tactics": "Tactiques",
        "predictions": "Prévisions",
        "performance": "Performance",
        "betting": "Paris"
      },
      "welcome_title": "Bienvenue sur le Hub Foot !",
      "welcome_subtitle": "Sélectionnez une ligue ou une nation pour commencer.",
      "live": "DIRECT",
      "upcoming": "À VENIR",
      "analyze": "Analyser",
      "expert_verdict": "Verdict de l'Expert",
      "head_to_head": "Comparaison Directe",
      "player": {
        "key_strengths": "Forces Clés",
        "recent_performance": "Performance Récente",
        "queued": "En attente",
        "compare": "Comparer",
        "compare_now": "Comparer maintenant",
        "clear": "Effacer",
        "selected": "Sélectionné",
        "trait": "Trait Clé",
        "top_strengths": "Meilleures Forces"
      },
      "match": {
        "competition": "Compétition",
        "match": "Match",
        "score_time": "Score / Heure",
        "status": "Statut",
        "verified_sources": "Sources vérifiées en temps réel",
        "forecasts": "Prévisions IA",
        "experimental": "Expérimental",
        "ai_pick": "Choix de l'IA",
        "confidence": "Confiance",
        "disclaimer": "Les prédictions de l'IA sont basées sur des tendances historiques. À titre informatif uniquement.",
        "pre_match": "Avant-match",
        "halftime": "Mi-temps",
        "post_match": "Après-match"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
