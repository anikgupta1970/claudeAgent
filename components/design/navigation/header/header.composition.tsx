import { Header } from './header.js';

export const BasicHeader = () => {
  return <Header />;
};

export const HeaderWithCustomLanguages = () => {
  return (
    <Header
      languages={[
        { value: 'en', label: 'English' },
        { value: 'hi', label: 'Hindi' },
        { value: 'ta', label: 'Tamil' },
      ]}
      selectedLanguage="en"
      onLanguageChange={(lang) => console.log('Language changed:', lang)}
    />
  );
};

export const HeaderWithChildren = () => {
  return (
    <Header>
      <nav>Navigation content</nav>
    </Header>
  );
};
