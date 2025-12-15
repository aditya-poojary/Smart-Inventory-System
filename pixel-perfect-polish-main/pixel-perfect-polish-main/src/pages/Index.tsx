import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to main app - this page is not used in the current navigation system
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-foreground">Smart Inventory System</h1>
        <p className="text-xl text-muted-foreground">AI-Powered Demand Forecasting</p>
      </div>
    </div>
  );
};

export default Index;
