"use client";
import { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Dialog from '@radix-ui/react-dialog';
import {
  PersonIcon,
  ExitIcon,
  GearIcon,
  Cross2Icon,
  MaskOnIcon
} from '@radix-ui/react-icons';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isAdmin?: boolean;
  canImpersonate?: boolean;
}

interface UserMenuProps {
  user: User | null;
  isImpersonating?: boolean;
  originalUser?: User | null;
  onLogout: () => void;
  onImpersonate?: (userId: string) => void;
  onStopImpersonating?: () => void;
}

export default function UserMenu({
  user,
  isImpersonating = false,
  originalUser,
  onLogout,
  onImpersonate,
  onStopImpersonating
}: UserMenuProps) {
  const [showImpersonateModal, setShowImpersonateModal] = useState(false);

  // Mock de usuarios disponibles para suplantación
  const availableUsers = [
    {
      id: '2',
      name: 'Juan Vendedor',
      email: 'juan@company.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
    },
    {
      id: '3',
      name: 'María Manager',
      email: 'maria@company.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face'
    },
    {
      id: '4',
      name: 'Carlos Cliente',
      email: 'carlos@company.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face'
    }
  ];

  const handleImpersonateUser = (targetUserId: string) => {
    if (onImpersonate) {
      onImpersonate(targetUserId);
    }
    setShowImpersonateModal(false);
  };

  if (!user) return null;

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="relative">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                  <PersonIcon className="w-5 h-5 text-white" />
                </div>
              )}
              {isImpersonating && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                  <MaskOnIcon className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-gray-900">
                {user.name}
                {isImpersonating && <span className="text-orange-600 ml-1">(Suplantando)</span>}
              </div>
              <div className="text-xs text-gray-500">{user.email}</div>
            </div>
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content 
            className="min-w-[280px] bg-white border border-gray-200 rounded-lg shadow-lg p-2"
            sideOffset={5}
          >
            {/* User Info Header */}
            <div className="px-3 py-2 border-b border-gray-200 mb-2">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center">
                      <PersonIcon className="w-7 h-7 text-white" />
                    </div>
                  )}
                  {isImpersonating && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                      <MaskOnIcon className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                  {isImpersonating && (
                    <div className="text-xs text-orange-600 font-medium">
                      Suplantando usuario
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Original User Info (when impersonating) */}
            {isImpersonating && originalUser && (
              <div className="px-3 py-2 bg-orange-50 rounded-lg mb-2">
                <div className="text-xs text-orange-600 font-medium mb-1">Usuario original:</div>
                <div className="flex items-center space-x-2">
                  {originalUser.avatar ? (
                    <img
                      src={originalUser.avatar}
                      alt={originalUser.name}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                      <PersonIcon className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-900">{originalUser.name}</div>
                    <div className="text-xs text-gray-500">{originalUser.email}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Menu Items */}
            <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm rounded cursor-pointer hover:bg-gray-100">
              <PersonIcon className="w-4 h-4 mr-3 text-gray-500" />
              Ver Perfil
            </DropdownMenu.Item>

            <DropdownMenu.Item className="flex items-center px-3 py-2 text-sm rounded cursor-pointer hover:bg-gray-100">
              <GearIcon className="w-4 h-4 mr-3 text-gray-500" />
              Configuración
            </DropdownMenu.Item>

            {/* Impersonation Controls */}
            {user.canImpersonate && !isImpersonating && (
              <>
                <DropdownMenu.Separator className="h-px bg-gray-200 my-2" />
                <DropdownMenu.Item 
                  className="flex items-center px-3 py-2 text-sm rounded cursor-pointer hover:bg-gray-100"
                  onClick={() => setShowImpersonateModal(true)}
                >
                  <MaskOnIcon className="w-4 h-4 mr-3 text-gray-500" />
                  Suplantar Usuario
                </DropdownMenu.Item>
              </>
            )}

            {isImpersonating && onStopImpersonating && (
              <>
                <DropdownMenu.Separator className="h-px bg-gray-200 my-2" />
                <DropdownMenu.Item 
                  className="flex items-center px-3 py-2 text-sm rounded cursor-pointer hover:bg-orange-100 text-orange-700"
                  onClick={onStopImpersonating}
                >
                  <MaskOnIcon className="w-4 h-4 mr-3" />
                  Detener Suplantación
                </DropdownMenu.Item>
              </>
            )}

            <DropdownMenu.Separator className="h-px bg-gray-200 my-2" />
            
            <DropdownMenu.Item 
              className="flex items-center px-3 py-2 text-sm rounded cursor-pointer hover:bg-red-100 text-red-700"
              onClick={onLogout}
            >
              <ExitIcon className="w-4 h-4 mr-3" />
              Cerrar Sesión
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {/* Impersonate Modal */}
      <Dialog.Root open={showImpersonateModal} onOpenChange={setShowImpersonateModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl w-full max-w-md z-50">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Suplantar Usuario
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="p-1 rounded hover:bg-gray-100">
                  <Cross2Icon className="w-5 h-5 text-gray-500" />
                </button>
              </Dialog.Close>
            </div>
            
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Selecciona un usuario para suplantar. Podrás ver la aplicación desde su perspectiva.
              </p>
              
              <div className="space-y-2">
                {availableUsers.map((targetUser) => (
                  <button
                    key={targetUser.id}
                    onClick={() => handleImpersonateUser(targetUser.id)}
                    className="w-full flex items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      {targetUser.avatar ? (
                        <img
                          src={targetUser.avatar}
                          alt={targetUser.name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                          <PersonIcon className="w-6 h-6 text-white" />
                        </div>
                      )}
                      <div className="text-left">
                        <div className="font-medium text-gray-900">{targetUser.name}</div>
                        <div className="text-sm text-gray-500">{targetUser.email}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}