import Sidebar from './components/Sidebar/Sidebar';
import AppRouter from './routes/AppRouter';
import AppInitializer from './AppInitializer'; // ← 이거 추가!

export default function App() {
  return (
    <div className="relative min-h-screen w-screen bg-gray-100">
      <AppInitializer>
        {/* <Sidebar /> */}
        <AppRouter />
      </AppInitializer>
    </div>
  );
}
