import { test, expect } from '@playwright/test';

// Estas pruebas deben comenzar sin una sesión iniciada
test.use({
    storageState: {
        cookies: [],
        origins: [],
    },
});

test.describe('Inicio de sesión', () => {

    test('permite iniciar sesión con credenciales correctas', async ({ page }) => {
        await page.goto('/login');

        await page.getByLabel('Correo electrónico').fill('playwright-test@example.com');
        await page.getByLabel('Contraseña').fill('TestPassword123!');

        await page.getByRole('button', { name: 'Iniciar Sesión' }).click();

        await expect(page).toHaveURL(/\/dashboard/);
    });

    test('muestra un error con credenciales incorrectas', async ({ page }) => {
        await page.goto('/login');

        await page.getByLabel('Correo electrónico').fill('playwright-test@example.com');
        await page.getByLabel('Contraseña').fill('ClaveIncorrecta123!');

        await page.getByRole('button', { name: 'Iniciar Sesión' }).click();

        await expect(page.getByRole('alert')).toBeVisible();
        await expect(page).toHaveURL(/\/login/);
    });

});
