import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
  className?: string;
}

interface Action<T> {
  label: string;
  icon: React.ReactNode;
  onClick: (item: T) => void;
  disabled?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  testId?: (item: T) => string;
}

interface ResponsiveDataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  emptyMessage?: string;
  testId?: string;
  getRowTestId?: (item: T) => string;
}

export default function ResponsiveDataTable<T extends { id: number | string }>({
  data,
  columns,
  actions = [],
  emptyMessage = "No data found.",
  testId = "data-table",
  getRowTestId
}: ResponsiveDataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground" data-testid={`no-${testId}`}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full data-table" data-testid={testId}>
          <thead>
            <tr className="border-b border-border">
              {columns.map((column) => (
                <th 
                  key={String(column.key)} 
                  className={`text-left py-3 text-sm font-medium text-muted-foreground ${column.className || ''}`}
                >
                  {column.label}
                </th>
              ))}
              {actions.length > 0 && (
                <th className="text-left py-3 text-sm font-medium text-muted-foreground">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr 
                key={String(item.id)} 
                className="border-b border-border hover:bg-muted" 
                data-testid={getRowTestId ? getRowTestId(item) : `${testId}-row-${item.id}`}
              >
                {columns.map((column) => (
                  <td 
                    key={String(column.key)} 
                    className={`py-3 text-sm ${column.className || ''}`}
                    data-testid={`${testId}-${String(column.key)}-${item.id}`}
                  >
                    {column.render 
                      ? column.render(item[column.key], item)
                      : String(item[column.key] || '')
                    }
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className="py-3 text-sm">
                    <div className="flex items-center space-x-2">
                      {actions.map((action, actionIndex) => (
                        <Button
                          key={actionIndex}
                          variant={action.variant || "ghost"}
                          size="sm"
                          onClick={() => action.onClick(item)}
                          disabled={action.disabled}
                          data-testid={action.testId ? action.testId(item) : `${testId}-action-${actionIndex}-${item.id}`}
                        >
                          {action.icon}
                        </Button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {data.map((item) => (
          <Card 
            key={String(item.id)} 
            className="shadow-sm"
            data-testid={getRowTestId ? getRowTestId(item) : `${testId}-card-${item.id}`}
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                {columns.map((column) => (
                  <div key={String(column.key)} className="flex justify-between items-start">
                    <span className="text-sm font-medium text-muted-foreground min-w-0 flex-1">
                      {column.label}
                    </span>
                    <span 
                      className="text-sm font-medium text-right ml-2"
                      data-testid={`${testId}-${String(column.key)}-${item.id}`}
                    >
                      {column.render 
                        ? column.render(item[column.key], item)
                        : String(item[column.key] || '')
                      }
                    </span>
                  </div>
                ))}
                
                {actions.length > 0 && (
                  <div className="flex justify-end space-x-2 pt-2 border-t border-border">
                    {actions.map((action, actionIndex) => (
                      <Button
                        key={actionIndex}
                        variant={action.variant || "ghost"}
                        size="sm"
                        onClick={() => action.onClick(item)}
                        disabled={action.disabled}
                        data-testid={action.testId ? action.testId(item) : `${testId}-action-${actionIndex}-${item.id}`}
                      >
                        {action.icon}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}