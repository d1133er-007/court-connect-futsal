
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ReactNode } from "react";

interface AuthFormWrapperProps {
  title: string;
  description: string;
  footer: {
    text: string;
    linkText: string;
    linkHref: string;
  };
  children: ReactNode;
}

export const AuthFormWrapper = ({ title, description, footer, children }: AuthFormWrapperProps) => {
  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-0">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
        <CardDescription className="text-center">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      <CardFooter className="flex justify-center pb-6">
        <p className="text-sm text-muted-foreground">
          {footer.text}{" "}
          <Link to={footer.linkHref} className="text-primary font-semibold hover:underline">
            {footer.linkText}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
