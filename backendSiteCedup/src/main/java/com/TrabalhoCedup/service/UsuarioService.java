package com.TrabalhoCedup.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.TrabalhoCedup.entity.Usuario;
import com.TrabalhoCedup.repository.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Método para autenticar o usuário (verificando as credenciais)
    public boolean autenticarUsuario(String email, String senha) {
        Usuario usuario = usuarioRepository.findByEmail(email);
        
        if (usuario != null && usuario.getSenha().equals(senha)) {
            return true; // Credenciais corretas
        } else {
            return false; // Credenciais incorretas
        }
    }

    // Método para buscar o usuário pelo email
    public Usuario findByEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }
}
