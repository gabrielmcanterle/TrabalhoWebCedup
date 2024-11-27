package com.TrabalhoCedup.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.TrabalhoCedup.entity.Usuario;
import com.TrabalhoCedup.service.UsuarioService;

@CrossOrigin(origins = "http://127.0.0.1:8081")  // Altere para o seu frontend
@RestController
@RequestMapping("/api/auth")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // 1. Endpoint para autenticação do usuário (verificação de credenciais)
    @PostMapping("/autenticar")
    public ResponseEntity<?> autenticar(@RequestBody Usuario usuario) {
        boolean autenticado = usuarioService.autenticarUsuario(usuario.getEmail(), usuario.getSenha());

        if (autenticado) {
            // Se a autenticação for bem-sucedida
            return ResponseEntity.ok().body("Autenticação bem-sucedida");
        } else {
            // Caso as credenciais estejam erradas
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email ou senha incorretos");
        }
    }

    // 2. Endpoint para login (geração de sessão ou token)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario usuario) {
        boolean autenticado = usuarioService.autenticarUsuario(usuario.getEmail(), usuario.getSenha());

        if (autenticado) {
            // Se autenticado, retorna o usuário com dados básicos ou um token
            Usuario usuarioLogado = usuarioService.findByEmail(usuario.getEmail());
            return ResponseEntity.ok(usuarioLogado); // Retorna o objeto Usuario com os dados
        } else {
            // Se as credenciais forem inválidas
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciais inválidas");
        }
    }
}
