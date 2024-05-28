type IconType = import('react-icons').IconType;

interface ArticleLayoutData {
  baseUrl: string;
  data: {
    title: string;
    headline: string;
    imageUrl?: string;
  };
  recomendations: RecomendationArticles[];
}

interface ArticleLayoutDataWorkout {
  baseUrl: string;
  data: {
    title: string;
    headline: string;
    imageUrl?: string;
  };
  recomendations: WorkoutArticles[];
}

interface AtricleDataInterface {
  type: string;
  content: string | string[];
}

interface RecomendationArticles {
  title: string;
  headline: string;
}

interface WorkoutArticles {
  title: string;
  headline: string;
  id: string;
  description: string;
}

interface SocialMediaBtnType {
  title: string;
  Icon: IconType;
  className: string;
  onClick: () => void;
}
