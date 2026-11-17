import { test, expect } from '@playwright/test';

const testUser = {
    username: 'Playwright Test',
    email: 'playwright-test@example.com',
    password: 'TestPassword123!',
};

test('crear usuario e iniciar sesión para las pruebas', async ({ page, request }) => {
    // 1. Intentar registrar el usuario de prueba
    const registerResponse = await request.post('/api/auth/register', {
        data: testUser,
    });

    // 201 = usuario creado
    // 409 = el usuario ya estaba registrado
    expect([201, 409]).toContain(registerResponse.status());

    // 2. Abrir la página de inicio de sesión
    await page.goto('/login');

    // 3. Completar el formulario
    await page.getByLabel('Correo electrónico').fill(testUser.email);
    await page.getByLabel('Contraseña').fill(testUser.password);

    // 4. Iniciar sesión
    await page.getByRole('button', { name: 'Iniciar Sesión' }).click();

    // 5. Comprobar que llegamos al Dashboard
    await expect(page).toHaveURL(/\/dashboard/);

    // 6. Guardar la sesión, incluyendo la cookie HttpOnly
    await page.context().storageState({
        path: 'playwright/.auth/user.json',
    });
});
