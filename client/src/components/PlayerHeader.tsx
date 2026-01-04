import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { User, LogOut, Menu, X } from 'lucide-react';

export function PlayerHeader() {
  const [, setLocation] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 獲取當前用戶信息
  const { data: user } = trpc.auth.me.useQuery();

  // 登出
  const logoutMutation = trpc.auth.logout.useMutation();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        // 清除本地存儲的遊戲狀態
        localStorage.clear();
        // 重新加載頁面以刷新用戶狀態
        window.location.href = '/';
      },
    });
  };

  return (
    <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setLocation('/')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
            Ω
          </div>
          <h1 className="font-bold text-foreground text-sm md:text-base">有機生命</h1>
        </div>

        {/* 桌面導航 */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-2 px-3 py-2 bg-background/50 rounded-lg border border-border/50">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <span className="text-sm text-foreground">{user.name || '玩家'}</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setLocation('/profile')}
                className="text-xs"
              >
                <User className="w-4 h-4 mr-1" />
                個人檔案
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleLogout}
                className="text-xs"
              >
                <LogOut className="w-4 h-4 mr-1" />
                登出
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-xs"
              onClick={() => window.location.href = '/api/auth/login'}
            >
              登入
            </Button>
          )}
        </div>

        {/* 移動菜單按鈕 */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-background/50 rounded-lg transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* 移動菜單 */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/50 backdrop-blur-sm">
          <div className="container py-4 space-y-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 bg-card/50 rounded-lg border border-border/50">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm text-foreground">{user.name || '玩家'}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setLocation('/profile');
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-xs justify-start"
                >
                  <User className="w-4 h-4 mr-2" />
                  個人檔案
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full text-xs justify-start"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  登出
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-xs justify-start"
                onClick={() => window.location.href = '/api/auth/login'}
              >
                登入
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
